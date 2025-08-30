import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { UserRatingsService } from 'src/userRatings/userRatings.service';
import { UserRating } from 'src/userRatings/userRating.entity';
import { MoviesService } from 'src/movies/movies.service';
import { AddRatingDto } from 'src/userRatings/dtos/add-rating.dto';
import { mockUserRating, mockMoviesService } from './utils/mock';
import { mockMovie, mockRepository } from '../common/mock';

describe('UserRatingsService', () => {
  let service: UserRatingsService;
  let userRatingRepository: typeof mockRepository;
  let moviesService: typeof mockMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRatingsService,
        {
          provide: getRepositoryToken(UserRating),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<UserRatingsService>(UserRatingsService);
    userRatingRepository = module.get(getRepositoryToken(UserRating));
    moviesService = module.get(MoviesService);

    jest.clearAllMocks();
  });

  describe('addRating', () => {
    const userId = 1;

    it('should successfully add a rating and return success message', async () => {
      const addRatingDto: AddRatingDto = { movieId: 1, rating: 5 };
      const expectedMessage = `User rated movie "${mockMovie.name}" with rating 5 successfully`;

      mockMoviesService.getMovieById.mockResolvedValue(mockMovie);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUserRating);
      mockRepository.save.mockResolvedValue(mockUserRating);

      const result = await service.addRating(userId, addRatingDto);

      expect(result).toEqual({
        message: expectedMessage,
      });
    });

    it('should throw ConflictException when user already rated the movie', async () => {
      const addRatingDto: AddRatingDto = { movieId: 1, rating: 5 };
      mockMoviesService.getMovieById.mockResolvedValue(mockMovie);
      mockRepository.findOne.mockResolvedValue(mockUserRating);

      await expect(service.addRating(userId, addRatingDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.addRating(userId, addRatingDto)).rejects.toThrow(
        'User has already rated this movie',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when movie does not exist', async () => {
      const addRatingDto: AddRatingDto = { movieId: 999, rating: 5 };
      mockMoviesService.getMovieById.mockRejectedValue(
        new Error('Movie not found'),
      );

      await expect(service.addRating(userId, addRatingDto)).rejects.toThrow(
        'Movie not found',
      );
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
