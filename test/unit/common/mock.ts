export const MOCK_JWT_TOKEN = 'mock.jwt.token';

export const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};
