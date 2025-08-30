import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { WatchListService } from 'src/watchList/watchList.service';
import { WatchList } from 'src/watchList/watchList.entity';
import { MoviesService } from 'src/movies/movies.service';
import { AddToWatchListDto } from 'src/watchList/dtos/add-to-watchList.dto';
import { mockWatchListItem, mockMoviesService } from './utils/mock';
import { mockMovie, mockRepository } from '../common/mock';

describe('WatchListService', () => {
  let service: WatchListService;
  let watchListRepository: typeof mockRepository;
  let moviesService: typeof mockMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchListService,
        {
          provide: getRepositoryToken(WatchList),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<WatchListService>(WatchListService);
    watchListRepository = module.get(getRepositoryToken(WatchList));
    moviesService = module.get(MoviesService);

    jest.clearAllMocks();
  });

  describe('addToWatchList', () => {
    const userId = 1;

    it('should successfully add movie to watchList and return success message', async () => {
      const addToWatchListDto: AddToWatchListDto = { movieId: 1 };
      const expectedMessage = `Movie "${mockMovie.name}" added to watchList successfully`;

      mockMoviesService.getMovieById.mockResolvedValue(mockMovie);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockWatchListItem);
      mockRepository.save.mockResolvedValue(mockWatchListItem);

      const result = await service.addToWatchList(userId, addToWatchListDto);

      expect(result).toEqual({
        message: expectedMessage,
      });
    });

    it('should throw ConflictException when movie is already in watchList', async () => {
      const addToWatchListDto: AddToWatchListDto = { movieId: 1 };
      mockMoviesService.getMovieById.mockResolvedValue(mockMovie);
      mockRepository.findOne.mockResolvedValue(mockWatchListItem);

      await expect(service.addToWatchList(userId, addToWatchListDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.addToWatchList(userId, addToWatchListDto)).rejects.toThrow(
        'Movie is already in user watchList',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when movie does not exist', async () => {
      const addToWatchListDto: AddToWatchListDto = { movieId: 999 };
      mockMoviesService.getMovieById.mockRejectedValue(
        new Error('Movie not found'),
      );

      await expect(service.addToWatchList(userId, addToWatchListDto)).rejects.toThrow(
        'Movie not found',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
