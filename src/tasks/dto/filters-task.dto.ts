import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsDate,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDTO } from './pagination.dto';
import { TaskStatus, TaskStatusList } from '../enum/task.enum';
import { Status } from 'generated/prisma';

export class FilterTaskDto extends PaginationDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(TaskStatusList, {
    each: true,
    message: `Valid status are ${TaskStatusList}`,
  })
  @Type(() => String)
  status?: Status[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  active?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;
}
