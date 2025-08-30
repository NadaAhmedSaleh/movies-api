import { User } from '../../../../src/users/user.entity';
import { SignupDto, LoginDto } from '../../../../src/users/dtos';

export const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: '$2a$10$hashedPasswordHash',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockSignupDto: SignupDto = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

export const mockLoginDto: LoginDto = {
  email: 'john@example.com',
  password: 'password123',
};

export const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockRepositoryToken = 'UserRepository';
