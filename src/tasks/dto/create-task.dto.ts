import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus, TaskStatusList } from '../enum/task.enum';
import { Status } from 'generated/prisma';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatusList, {
    message: `Valid status are ${TaskStatusList}`,
  })
  status?: Status;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
