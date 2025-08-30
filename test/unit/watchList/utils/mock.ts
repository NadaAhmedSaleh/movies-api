import { WatchList } from 'src/watchList/watchList.entity';
import { AddToWatchListDto } from 'src/watchList/dtos/add-to-watchList.dto';

export const mockWatchListItem: WatchList = {
  userId: 1,
  movieId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: null,
  movie: null,
};

export const mockAddToWatchListDto: AddToWatchListDto = {
  movieId: 1,
};

export const mockMoviesService = {
  getMovieById: jest.fn(),
};
