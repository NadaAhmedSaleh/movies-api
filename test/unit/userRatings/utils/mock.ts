import { UserRating } from 'src/userRatings/userRating.entity';
import { AddRatingDto } from 'src/userRatings/dtos/add-rating.dto';

export const mockUserRating: UserRating = {
  userId: 1,
  movieId: 1,
  rating: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: null,
  movie: null,
};

export const mockAddRatingDto: AddRatingDto = {
  movieId: 1,
  rating: 5,
};

export const mockMoviesService = {
  getMovieById: jest.fn(),
};
