import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilterTaskDto } from './dto/filters-task.dto';
import { Prisma, Task } from 'generated/prisma';
import { StatusDTO } from './dto/status.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.prisma.task.create({
        data: createTaskDto,
      });
    } catch (error) {
      this.logger.error(error, 'Error creating task');
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        debug: {
          error: error.message,
        },
      });
    }
  }

  async findWithFilters(filters: FilterTaskDto) {
    try {
      const { page, limit } = filters;
      const total = await this.prisma.task.count({ where: { active: true } });
      const where = this.getFilters(filters);
      const lastPage = Math.ceil(total / limit);
      const tasks = await this.prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        data: tasks,
        meta: {
          lastPage: lastPage,
          total: total,
          page: page,
        },
      };
    } catch (error) {
      this.logger.error(error, 'Error finding tasks');
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        debug: {
          error: error.message,
        },
      });
    }
  }

  private getFilters(filters: FilterTaskDto): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {};
    if (filters.title) {
      where.title = {
        contains: filters.title,
        mode: 'insensitive',
      };
    }

    if (filters.description) {
      where.description = {
        contains: filters.description,
        mode: 'insensitive',
      };
    }

    if (filters.status && filters.status.length > 0) {
      where.status = {
        in: filters.status,
      };
    }

    where.active = true;

    if (filters.dueDate) {
      const startOfDay = new Date(filters.dueDate);
      startOfDay.setHours(0, 0, 0);

      const endOfDay = new Date(filters.dueDate);
      endOfDay.setHours(23, 59, 59);

      where.dueDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }
    return where;
  }

  async updateStatus(id: number, changeStatusDto: StatusDTO) {
    try {
      const { status } = changeStatusDto;

      await this.ensureTaskExists(id);

      return await this.prisma.task.update({
        where: { id },
        data: {
          status: status,
        },
      });
    } catch (error) {
      this.logger.error(`Error updating status task for ID ${id}`);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        debug: {
          error: error.message,
        },
      });
    }
  }

  async ensureTaskExists(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) throw new NotFoundException(`Task with id ${id} not found`);

    return task;
  }
}
