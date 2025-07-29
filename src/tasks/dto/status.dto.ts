import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatusList } from '../enum/task.enum';
import { Status } from '../../../generated/prisma';

export class StatusDTO {
  @IsOptional()
  @IsEnum(TaskStatusList, {
    message: `Valid status are ${TaskStatusList}`,
  })
  status: Status;
}
