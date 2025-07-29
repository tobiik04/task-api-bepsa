import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import 'reflect-metadata';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
