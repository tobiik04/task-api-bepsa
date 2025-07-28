import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterTaskDto } from './dto/filters-task.dto';
import { Prisma } from 'generated/prisma';
import { StatusDTO } from './dto/status.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
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
      const where = this.getFilters(filters);
      const tasks = await this.prisma.task.findMany({
        where,
        skip: filters.page ? (filters.page - 1) * filters.limit : 0,
        take: filters.limit,
      });
      return tasks;
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
      return await this.prisma.task.update({
        where: { id },
        data: {
          status: status,
        },
      });
    } catch (error) {
      this.logger.error(error, 'Error updating status task');
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        debug: {
          error: error.message,
        },
      });
    }
  }
}
