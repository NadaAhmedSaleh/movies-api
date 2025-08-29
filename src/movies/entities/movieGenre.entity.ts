import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { Genre } from '../../genres/genre.entity';
import { BaseTimestampEntity } from 'src/common/entities/BaseTimestampEntity';

@Entity('movie_genres')
export class MovieGenre extends BaseTimestampEntity {
  @PrimaryColumn({ name: 'movie_id' })
  movieId: number;

  @PrimaryColumn({ name: 'genre_id' })
  genreId: number;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}
