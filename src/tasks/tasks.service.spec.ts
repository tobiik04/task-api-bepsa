import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filters-task.dto';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
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
    await expect(service.ensureTaskExists(id)).rejects.toThrow(
      NotFoundException,
    );
    await expect(service.ensureTaskExists(id)).rejects.toThrow(
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

  it('should return tasks with pagination metadata (minimal filters)', async () => {
    const filters: FilterTaskDto = {
      status: ['PENDING'],
      page: 1,
      limit: 10,
    };

    const mockTasks = [];
    const total = 1;
    const lastPage = 1;

    mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
    mockPrismaService.task.count.mockResolvedValue(total);

    const result = await service.findWithFilters(filters);

    expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          active: true,
          status: { in: ['PENDING'] },
        }),
        skip: 0,
        take: 10,
      }),
    );

    expect(result).toEqual({
      data: mockTasks,
      meta: {
        lastPage: lastPage,
        total: total,
        page: 1,
      },
    });
  });

  it('should return tasks with all filters applied', async () => {
    const filters: FilterTaskDto = {
      status: ['PENDING'],
      title: 'test',
      description: 'desc',
      dueDate: new Date(),
      page: 1,
      limit: 10,
    };

    const mockTasks = [];
    const total = 1;
    const lastPage = 1;

    mockPrismaService.task.findMany.mockResolvedValue(mockTasks);
    mockPrismaService.task.count.mockResolvedValue(total);

    const result = await service.findWithFilters(filters);

    expect(mockPrismaService.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          title: expect.any(Object),
          description: expect.any(Object),
          dueDate: expect.any(Object),
          status: { in: ['PENDING'] },
          active: true,
        }),
        skip: 0,
        take: 10,
      }),
    );

    expect(result).toEqual({
      data: mockTasks,
      meta: {
        lastPage: lastPage,
        total: total,
        page: 1,
      },
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
