import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([
      { id: '1', firstName: 'John', lastName: 'Mocked User', role: { name: 'TUTOR' } },
    ]),
    getRoles: jest.fn().mockResolvedValue([{ id: 'role-1', name: 'TUTOR' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result[0].lastName).toBe('Mocked User');
  });

  it('should return roles', async () => {
    const roles = await controller.getRoles();
    expect(roles[0].name).toBe('TUTOR');
  });
});
