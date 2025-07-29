import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filters-task.dto';
import { StatusDTO } from './dto/status.dto';
import { ApiKeyGuard } from './guard/api-key.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(ApiKeyGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @UseGuards(ApiKeyGuard)
  @Get()
  findWithFilters(@Query() filters: FilterTaskDto) {
    return this.tasksService.findWithFilters(filters);
  }

  @UseGuards(ApiKeyGuard)
  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: StatusDTO,
  ) {
    return this.tasksService.updateStatus(id, changeStatusDto);
  }
}
