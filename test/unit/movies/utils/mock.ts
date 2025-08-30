import { Repository } from 'typeorm';
import { Movie } from '../../../../src/movies/entities/movie.entity';
import {
  AuthenticatedMovieFiltersDto,
  SortBy,
  SortOrder,
} from '../../../../src/movies/dtos';

export const mockMovie1: Movie = {
  id: 1,
  name: 'Test Movie 1',
  createdAt: new Date(),
  updatedAt: new Date(),
  movieGenres: [
    {
      movieId: 1,
      genreId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      movie: null,
      genre: {
        id: 1,
        genre: 'Action',
        createdAt: new Date(),
        updatedAt: new Date(),
        movieGenres: [],
      },
    },
  ],
};

export const mockMovie2: Movie = {
  id: 2,
  name: 'Test Movie 2',
  createdAt: new Date(),
  updatedAt: new Date(),
  movieGenres: [
    {
      movieId: 2,
      genreId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      movie: null,
      genre: {
        id: 2,
        genre: 'Drama',
        createdAt: new Date(),
        updatedAt: new Date(),
        movieGenres: [],
      },
    },
  ],
};

export const mockMovie3: Movie = {
  id: 3,
  name: 'Test Movie 3',
  createdAt: new Date(),
  updatedAt: new Date(),
  movieGenres: [
    {
      movieId: 3,
      genreId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      movie: null,
      genre: {
        id: 3,
        genre: 'Comedy',
        createdAt: new Date(),
        updatedAt: new Date(),
        movieGenres: [],
      },
    },
  ],
};

export const mockMovie = mockMovie1; // Keep for backward compatibility

export const mockFilters: AuthenticatedMovieFiltersDto = {
  limit: 10,
  offset: 0,
  sortBy: SortBy.NAME,
  sortOrder: SortOrder.ASC,
};

export const mockRepository = {
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
};

export const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  getCount: jest.fn(),
  getMany: jest.fn(),
  getRawMany: jest.fn(),
  where: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
};
