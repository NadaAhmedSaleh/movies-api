import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovieGenre } from '../movies/entities/movieGenre.entity';
import { BaseTimestampEntity } from 'src/common/entities/BaseTimestampEntity';

@Entity('genres')
export class Genre extends BaseTimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  genre: string;

  @OneToMany(() => MovieGenre, (movieGenre) => movieGenre.genre)
  movieGenres: MovieGenre[];
}
