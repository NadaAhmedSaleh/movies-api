import { DataSource } from 'typeorm';
import { logger } from '../config/logger.config';

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovie {
  id: number;
  title: string;
  genre_ids: number[];
}

interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

interface TMDBMoviesResponse {
  results: TMDBMovie[];
  total_pages: number;
}

async function fetchTMDBData(endpoint: string): Promise<any> {
  const token = process.env.TMDB_TOKEN;
  if (!token) {
    throw new Error('TMDB_TOKEN environment variable is required');
  }

  const response = await fetch(`https://api.themoviedb.org/3${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

async function fetchPopularMovies(limit: number = 10): Promise<TMDBMovie[]> {
  const allMovies: TMDBMovie[] = [];

  for (let page = 1; page <= limit; page++) {
    logger.info(`Fetching movies page ${page}...`);
    const response: TMDBMoviesResponse = await fetchTMDBData(
      `/movie/popular?language=en-US&page=${page}`,
    );
    allMovies.push(...response.results);
  }

  return allMovies;
}

async function insertGenres(queryRunner: any): Promise<void> {
  const response: TMDBGenresResponse = await fetchTMDBData(
    '/genre/movie/list?language=en',
  );
  const { genres } = response;
  if (genres.length === 0) return;

  const values = genres.map((genre) => [genre.id, genre.name]);
  const placeholders = values.map(() => '(?, ?)').join(', ');

  await queryRunner.query(
    `INSERT IGNORE INTO genres (id, genre) VALUES ${placeholders}`,
    values.flat(),
  );

  logger.info(`Inserted ${genres.length} genres`);
}

async function insertMovies(queryRunner: any): Promise<TMDBMovie[]> {
  const movies: TMDBMovie[] = await fetchPopularMovies(10);

  if (movies.length === 0) return [];

  const values = movies.map((movie) => [movie.id, movie.title]);
  const placeholders = values.map(() => '(?, ?)').join(', ');

  await queryRunner.query(
    `INSERT IGNORE INTO movies (id, name) VALUES ${placeholders}`,
    values.flat(),
  );

  logger.info(`Inserted ${movies.length} movies`);
  return movies;
}

async function insertMovieGenres(
  queryRunner: any,
  movies: TMDBMovie[],
): Promise<void> {
  const movieGenreValues: [string, number][] = [];

  for (const movie of movies) {
    for (const genreId of movie.genre_ids) {
      movieGenreValues.push([movie.id.toString(), genreId]);
    }
  }

  if (movieGenreValues.length === 0) return;

  const placeholders = movieGenreValues.map(() => '(?, ?)').join(', ');

  await queryRunner.query(
    `INSERT IGNORE INTO movie_genres (movie_id, genre_id) VALUES ${placeholders}`,
    movieGenreValues.flat(),
  );

  logger.info(`Inserted ${movieGenreValues.length} movie genre relations`);
}

export async function up(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    logger.info('Starting TMDB data migration...');

    const movies = await insertMovies(queryRunner);
    await insertGenres(queryRunner);

    await insertMovieGenres(queryRunner, movies);

    await queryRunner.commitTransaction();
    logger.info('TMDB data migration completed successfully!');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    logger.error('Error during TMDB data migration:', error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export async function down(dataSource: DataSource) {
  logger.info('Rolling back TMDB data migration...');

  await dataSource.query('DELETE FROM movie_genres');
  await dataSource.query('DELETE FROM movies');
  await dataSource.query('DELETE FROM genres');

  logger.info('TMDB data migration rolled back successfully!');
}
