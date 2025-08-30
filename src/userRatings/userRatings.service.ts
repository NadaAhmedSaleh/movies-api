import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRating } from './userRating.entity';
import { AddRatingDto } from './dtos/add-rating.dto';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class UserRatingsService {
  constructor(
    @InjectRepository(UserRating)
    private userRatingRepository: Repository<UserRating>,
    private moviesService: MoviesService,
  ) {}

  async addRating(userId: number, addRatingDto: AddRatingDto) {
    const { movieId, rating } = addRatingDto;

    const movie = await this.moviesService.getMovieById(movieId);

    // Check if user already rated this movie
    const existingRating = await this.userRatingRepository.findOne({
      where: { userId, movieId },
    });

    if (existingRating) {
      throw new ConflictException('User has already rated this movie');
    }

    // Create new rating
    const userRating = this.userRatingRepository.create({
      userId,
      movieId,
      rating,
    });

    await this.userRatingRepository.save(userRating);

    return {
      message: `User rated movie "${movie.name}" with rating ${rating} successfully`,
    };
  }
}
