import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filters-task.dto';
import { StatusDTO } from './dto/status.dto';
import { ApiKeyGuard } from './guard/api-key.guard';
import { UnauthorizedException } from '@nestjs/common';

const mockApiKeyGuard = {
  canActivate: jest.fn(() => true),
};

const mockTasksService = {
  create: jest.fn(),
  findWithFilters: jest.fn(),
  updateStatus: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideProvider(ApiKeyGuard)
      .useValue(mockApiKeyGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create with dto', async () => {
    const dto: CreateTaskDto = {
      title: 'Test task',
      description: 'Test description',
      dueDate: new Date(),
    };
    const result = { id: 1, ...dto };

    mockTasksService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findWithFilters with filters', async () => {
    const filters: FilterTaskDto = {
      title: 'test',
      description: 'desc',
      status: ['PENDING'],
    };
    const result = [{ id: 1, title: 'test' }];

    mockTasksService.findWithFilters.mockResolvedValue(result);

    expect(await controller.findWithFilters(filters)).toEqual(result);
    expect(service.findWithFilters).toHaveBeenCalledWith(filters);
  });

  it('should call service.updateStatus with id and status dto', async () => {
    const statusDto: StatusDTO = { status: 'CANCELLED' };
    const result = { id: 1, status: 'CANCELLED' };

    mockTasksService.updateStatus.mockResolvedValue(result);

    expect(await controller.updateStatus(1, statusDto)).toEqual(result);
    expect(service.updateStatus).toHaveBeenCalledWith(1, statusDto);
  });
});
