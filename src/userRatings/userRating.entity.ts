import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Movie } from '../movies/entities/movie.entity';
import { BaseTimestampEntity } from 'src/common/entities/BaseTimestampEntity';

@Entity('user_ratings')
export class UserRating extends BaseTimestampEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'movie_id' })
  movieId: number;

  @Column({ type: 'int', width: 1 })
  rating: number; // 0-5

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
