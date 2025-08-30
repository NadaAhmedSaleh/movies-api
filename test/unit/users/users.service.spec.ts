import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../../src/users/users.service';
import { User } from '../../../src/users/user.entity';
import {
  mockUser,
  mockSignupDto,
  mockLoginDto,
  mockRepository,
} from './utils/mock';
import { mockJwtService } from '../common/mock';
import { HASHED_PASSWORD, MOCK_JWT_TOKEN } from './utils/constants';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const savedUser = { ...mockUser, password: HASHED_PASSWORD };

      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(HASHED_PASSWORD);
      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);
      mockJwtService.sign.mockReturnValue(MOCK_JWT_TOKEN);

      const result = await service.signup(mockSignupDto);

      expect(mockRepository.save).toHaveBeenCalledWith(savedUser);

      expect(result).toEqual({
        message: 'User created successfully',
        token: MOCK_JWT_TOKEN,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.signup(mockSignupDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signup(mockSignupDto)).rejects.toThrow(
        'Email already exists',
      );

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle bcrypt hash errors', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hash error'));

      await expect(service.signup(mockSignupDto)).rejects.toThrow('Hash error');

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(MOCK_JWT_TOKEN);

      const result = await service.login(mockLoginDto);

      expect(result).toEqual({
        message: 'Login successful',
        token: MOCK_JWT_TOKEN,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(mockLoginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
