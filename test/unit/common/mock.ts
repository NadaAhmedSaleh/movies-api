import { Movie } from 'src/movies/entities/movie.entity';

export const MOCK_JWT_TOKEN = 'mock.jwt.token';

export const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockMovie: Movie = {
  id: 1,
  name: 'Test Movie',
  createdAt: new Date(),
  updatedAt: new Date(),
  movieGenres: [],
};
