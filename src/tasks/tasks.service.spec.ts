import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Task 1',
      description: 'Desc',
      dueDate: new Date(),
    };

    const expected = { id: 1, ...dto };

    mockPrismaService.task.create.mockResolvedValue(expected);

    const result = await service.create(dto);

    expect(result).toEqual(expected);
  });

  it('should invalid if task not exists', async () => {
    const id = 900000;
    await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(id)).rejects.toThrow(
      `Task with id ${id} not found`,
    );
  });

  it('should invalid if create fails', async () => {
    mockPrismaService.task.create.mockRejectedValue(new Error('DB error'));
    const dto: CreateTaskDto = {
      title: 'error',
      description: 'tira error',
      dueDate: new Date(),
    };
    await expect(service.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should return filtered tasks', async () => {
    const filters = {
      title: 'abc',
      description: 'desc',
      status: ['PENDING'],
      dueDate: new Date('2025-07-29'),
      page: 1,
      limit: 10,
    };

    const expected = [{ id: 1, title: 'abc' }];
    mockPrismaService.task.findMany.mockResolvedValue(expected);

    const result = await service.findWithFilters(filters as any);
    expect(result).toEqual(expected);
    expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        title: expect.any(Object),
        description: expect.any(Object),
        status: { in: ['PENDING'] },
        dueDate: expect.any(Object),
        active: true,
      }),
      skip: 0,
      take: 10,
    });
  });

  it('should update task status', async () => {
    const id = 1;
    const expected = { id, status: 'CANCELLED' };
    mockPrismaService.task.findUnique.mockResolvedValue({ id });

    mockPrismaService.task.update.mockResolvedValue(expected);

    const result = await service.updateStatus(1, {
      status: 'CANCELLED',
    });
    expect(result).toEqual(expected);
    expect(mockPrismaService.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'CANCELLED' },
    });
  });
});
