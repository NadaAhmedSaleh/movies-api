import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { AuthenticatedMovieFiltersDto, SortBy, SortOrder } from './dtos';
import { RedisService } from '../common/services/redis.service';
import { ALL_MOVIES_CACHE_KEY } from './utils/constants';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private redisService: RedisService,
  ) {}

  async getMovieById(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async listMovies(filters: AuthenticatedMovieFiltersDto, userId?: number) {
    // Build base query
    const queryBuilder = this.movieRepository
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.movieGenres', 'mg')
      .leftJoinAndSelect('mg.genre', 'g');

    // Apply filters
    if (filters) {
      this.applyFilters(queryBuilder, filters, userId);
    }

    // Handle rating sorting differently
    if (filters?.sortBy === SortBy.RATING) {
      return this.handleRatingSorting(queryBuilder, filters, userId);
    }

    // Apply non-rating sorting
    if (filters?.sortBy && filters?.sortOrder) {
      queryBuilder.orderBy(filters.sortBy, filters.sortOrder);
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    queryBuilder.limit(limit).offset(offset);

    // Get movies
    const movies = await queryBuilder.getMany();

    // Get additional data (ratings and watch list)
    const movieIds = movies.map((movie) => movie.id);
    const [ratingsMap, watchListMap] = await Promise.all([
      this.getRatingsForMovies(movieIds),
      userId
        ? this.getWatchListForMovies(movieIds, userId)
        : Promise.resolve(new Map()),
    ]);

    // Format response
    const formattedMovies = this.formatMovies(
      movies,
      ratingsMap,
      watchListMap,
      userId,
      filters,
    );

    return {
      movies: formattedMovies,
      pagination: {
        total,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + limit < total,
        hasPrevious: offset > 0,
      },
    };
  }

  private async handleRatingSorting(
    queryBuilder: any,
    filters: AuthenticatedMovieFiltersDto,
    userId?: number,
  ) {
    // Try to get all movies from cache first
    const cachedMovies = await this.redisService.get(ALL_MOVIES_CACHE_KEY);
    let allMovies;

    if (cachedMovies) {
      allMovies = JSON.parse(cachedMovies);
      console.log('Using cached movies');
    } else {
      // Get all movies without pagination for rating sorting
      allMovies = await queryBuilder.getMany();
      // Cache all movies for 1 day
      await this.redisService.set(
        ALL_MOVIES_CACHE_KEY,
        JSON.stringify(allMovies),
        24 * 60 * 60,
      );
      console.log('Cached movies for 1 day');
    }

    // Get ratings and watch list for all movies
    const movieIds = allMovies.map((movie) => movie.id);
    const [ratingsMap, watchListMap] = await Promise.all([
      this.getRatingsForMovies(movieIds),
      userId
        ? this.getWatchListForMovies(movieIds, userId)
        : Promise.resolve(new Map()),
    ]);

    // Format and sort by rating
    let formattedMovies = this.formatMovies(
      allMovies,
      ratingsMap,
      watchListMap,
      userId,
      filters,
    );

    // Apply pagination after sorting
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;
    const paginatedMovies = formattedMovies.slice(offset, offset + limit);

    return {
      movies: paginatedMovies,
      pagination: {
        total: formattedMovies.length,
        limit,
        offset,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(formattedMovies.length / limit),
        hasNext: offset + limit < formattedMovies.length,
        hasPrevious: offset > 0,
      },
    };
  }

  private applyFilters(
    queryBuilder: any,
    filters: AuthenticatedMovieFiltersDto,
    userId?: number,
  ) {
    if (filters.search) {
      queryBuilder.andWhere('m.name LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.genres && filters.genres.length > 0) {
      queryBuilder.andWhere('g.id IN (:...genres)', { genres: filters.genres });
    }

    if (filters.watchListOnly && userId) {
      queryBuilder
        .leftJoin(
          'watch_list',
          'wl',
          'wl.movie_id = m.id AND wl.user_id = :userId',
          { userId },
        )
        .andWhere('wl.movie_id IS NOT NULL');
    }
  }

  private async getRatingsForMovies(movieIds: number[]) {
    if (movieIds.length === 0) return new Map();

    const ratings = await this.movieRepository
      .createQueryBuilder('m')
      .leftJoin('user_ratings', 'ur', 'ur.movie_id = m.id')
      .select([
        'm.id as movieId',
        'COALESCE(AVG(ur.rating), 0) as avgRating',
        'COUNT(DISTINCT ur.user_id) as totalRatings',
      ])
      .where('m.id IN (:...movieIds)', { movieIds })
      .groupBy('m.id')
      .getRawMany();

    return new Map(
      ratings.map((r) => [
        r.movieId,
        {
          avgRating: parseFloat(r.avgRating),
          totalRatings: parseInt(r.totalRatings),
        },
      ]),
    );
  }

  private async getWatchListForMovies(movieIds: number[], userId: number) {
    if (movieIds.length === 0) return new Map();

    const watchList = await this.movieRepository
      .createQueryBuilder('m')
      .leftJoin(
        'watch_list',
        'wl',
        'wl.movie_id = m.id AND wl.user_id = :userId',
        { userId },
      )
      .select([
        'm.id as movieId',
        'CASE WHEN wl.movie_id IS NOT NULL THEN true ELSE false END as inWatchList',
      ])
      .where('m.id IN (:...movieIds)', { movieIds })
      .getRawMany();
    return new Map(watchList.map((r) => [r.movieId, r.inWatchList == 1]));
  }

  private formatMovies(
    movies: Movie[],
    ratingsMap: Map<number, any>,
    watchListMap: Map<number, boolean>,
    userId?: number,
    filters?: AuthenticatedMovieFiltersDto,
  ) {
    let formattedMovies = movies.map((movie) => {
      const ratingData = ratingsMap.get(movie.id) || {
        avgRating: 0,
        totalRatings: 0,
      };

      const movieData: any = {
        id: movie.id,
        name: movie.name,
        genres: movie.movieGenres.map((mg) => ({
          id: mg.genre.id,
          name: mg.genre.genre,
        })),
        averageRating: ratingData.avgRating,
        totalRatings: ratingData.totalRatings,
      };

      // Only include inWatchList for authenticated users
      if (userId) {
        movieData.inWatchList = watchListMap.get(movie.id) || false;
      }

      return movieData;
    });

    // Apply rating sorting if needed (after getting the data)
    if (filters?.sortBy === SortBy.RATING) {
      formattedMovies.sort((a, b) => {
        const order = filters.sortOrder === SortOrder.ASC ? 1 : -1;
        return (a.averageRating - b.averageRating) * order;
      });
    }

    return formattedMovies;
  }
}
