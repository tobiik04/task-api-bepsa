import { validate } from 'class-validator';
import { FilterTaskDto } from './filters-task.dto';
import { plainToInstance } from 'class-transformer';

describe('FilterTaskDto', () => {
  it('should be valid with correct types', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      title: 'Task prueba',
      description: 'Cualquier cosa',
      status: ['PENDING', 'CANCELLED'],
      active: true,
      dueDate: new Date().toISOString(),
      page: 1,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid with correct page and limit', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      page: 1,
      limit: 10,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid page (string)', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      page: 'one',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should fail with invalid page (negative number)', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      page: -3,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('page');
  });

  it('should fail with invalid limit (string)', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      limit: 'many',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail with invalid limit (zero)', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      limit: 0,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('limit');
  });

  it('should fail with invalid status', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      status: ['INVALID'],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with invalid dueDate', async () => {
    const dto = plainToInstance(FilterTaskDto, {
      dueDate: 'asdada',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
