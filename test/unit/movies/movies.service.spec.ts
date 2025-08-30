import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesService } from '../../../src/movies/movies.service';
import { Movie } from '../../../src/movies/entities/movie.entity';
import {
  mockMovie,
  mockMovie1,
  mockMovie2,
  mockMovie3,
  mockFilters,
  mockRepository,
  mockQueryBuilder,
} from './utils/mock';
import { SortBy, SortOrder } from '../../../src/movies/dtos';
import { Repository } from 'typeorm';
import { RedisService } from '../../../src/common/services/redis.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let mockMovieRepository: jest.Mocked<Repository<Movie>>;
  let mockRedisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const mockRedisServiceInstance = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisServiceInstance,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    mockMovieRepository = module.get(getRepositoryToken(Movie));
    mockRedisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovieById', () => {
    it('should return a movie when found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.getMovieById(1);

      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockMovieRepository.findOne.mockResolvedValue(null);

      await expect(service.getMovieById(999)).rejects.toThrow(
        'Movie not found',
      );
    });
  });

  describe('listMovies', () => {
    it('should return movies without inWatchList for non-authenticated user', async () => {
      // Setup mocks
      mockMovieRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );
      mockQueryBuilder.getCount.mockResolvedValue(1);
      mockQueryBuilder.getMany.mockResolvedValue([mockMovie]);
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { movieId: 1, avgRating: '4.5', totalRatings: '10' },
      ]);

      const result = await service.listMovies(mockFilters);

      // Verify the response structure
      expect(result.movies).toHaveLength(1);
      expect(result.movies[0]).toEqual({
        id: mockMovie.id,
        name: mockMovie.name,
        genres: mockMovie.movieGenres.map((mg) => ({
          id: mg.genre.id,
          name: mg.genre.genre,
        })),
        averageRating: 4.5,
        totalRatings: 10,
        // inWatchList should NOT be present for non-authenticated users
      });
      expect(result.movies[0]).not.toHaveProperty('inWatchList');
      expect(result.pagination).toBeDefined();
    });

    it('should return movies with inWatchList for authenticated user', async () => {
      mockMovieRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
      mockQueryBuilder.getCount.mockResolvedValue(2);
      mockQueryBuilder.getMany.mockResolvedValue([mockMovie1, mockMovie2]);
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([
          { movieId: 1, avgRating: '4.5', totalRatings: '10' },
          { movieId: 2, avgRating: '3.8', totalRatings: '8' },
        ])
        .mockResolvedValueOnce([
          { movieId: 1, inWatchList: 1 },
          { movieId: 2, inWatchList: 0 },
        ]);

      const result = await service.listMovies(mockFilters, 123);

      expect(result.movies).toHaveLength(2);
      expect(result.movies[0].inWatchList).toBe(true);
      expect(result.movies[1].inWatchList).toBe(false);
      expect(result.pagination).toBeDefined();
    });

    it('should handle rating sorting correctly with cache miss', async () => {
      const ratingFilters = {
        ...mockFilters,
        sortBy: SortBy.RATING,
        sortOrder: SortOrder.DESC,
      };

      // Mock cache miss
      mockRedisService.get.mockResolvedValue(null);

      mockMovieRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
      mockQueryBuilder.getMany.mockResolvedValue([mockMovie1, mockMovie2, mockMovie3]);
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce([
          { movieId: 1, avgRating: '3.5', totalRatings: '5' },
          { movieId: 2, avgRating: '4.8', totalRatings: '15' },
          { movieId: 3, avgRating: '2.1', totalRatings: '3' },
        ])
        .mockResolvedValueOnce([
          { movieId: 1, inWatchList: 0 },
          { movieId: 2, inWatchList: 1 },
          { movieId: 3, inWatchList: 0 },
        ]);

      const result = await service.listMovies(ratingFilters, 123);

      expect(result.movies).toHaveLength(3);
      expect(result.movies[0].averageRating).toBe(4.8);
      expect(result.movies[0].id).toBe(2);
      expect(result.movies[1].averageRating).toBe(3.5);
      expect(result.movies[1].id).toBe(1);
      expect(result.movies[2].averageRating).toBe(2.1);
      expect(result.movies[2].id).toBe(3);
      expect(result.movies[0].inWatchList).toBe(true);
      expect(result.movies[1].inWatchList).toBe(false);
      expect(result.movies[2].inWatchList).toBe(false);
      expect(result.pagination).toBeDefined();
    });
  });
});
