import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.role.findUnique.mockResolvedValue({ id: 'role1', name: 'TUTOR' });
    mockPrisma.user.create.mockResolvedValue({ id: 'user1', username: 'testuser' });

    const result = await service.createUser({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    });

    expect(mockPrisma.user.create).toHaveBeenCalled();
    expect(result.username).toBe('testuser');
  });

  it('should throw conflict if username exists', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', username: 'testuser' });
    await expect(
      service.createUser({ email: 'a', username: 'testuser', password: '1234' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should find all users', async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ username: 'a' }, { username: 'b' }]);
    const result = await service.findAll();
    expect(result.length).toBe(2);
  });

 

  it('should update a user', async () => {
    mockPrisma.user.update.mockResolvedValue({ id: '1', firstName: 'John' });
    const result = await service.updateUser('1', { firstName: 'John' });
    expect(result.firstName).toBe('John');
  });

  it('should delete a user', async () => {
    mockPrisma.user.delete.mockResolvedValue({ id: '1' });
    const result = await service.deleteUser('1');
    expect(result.id).toBe('1');
  });

  it('should get roles', async () => {
    mockPrisma.role.findMany.mockResolvedValue([{ name: 'ADMIN' }, { name: 'USER' }]);
    const result = await service.getRoles();
    expect(result).toHaveLength(2);
  });
});
