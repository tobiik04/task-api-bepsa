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

@UseGuards(ApiKeyGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
  @Get()
  findWithFilters(@Query() filters: FilterTaskDto) {
    return this.tasksService.findWithFilters(filters);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: StatusDTO,
  ) {
    return this.tasksService.updateStatus(id, changeStatusDto);
  }
}
