import { validate } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../enum/task.enum';
import { plainToInstance } from 'class-transformer';

describe('CreateTaskDto', () => {
  it('should be valid with correct data', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      description: 'Task description',
      status: TaskStatus.CANCELLED,
      dueDate: new Date(),
      active: true,
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid without title', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      description: 'Description only',
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    const titleError = errors.find((e) => e.property === 'title');
    expect(titleError).toBeDefined();
  });

  it('should be invalid without description', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    const descriptionError = errors.find((e) => e.property === 'description');
    expect(descriptionError).toBeDefined();
  });

  it('should be invalid with invalid status', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      description: 'Description',
      status: 'PNDING',
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    const statusError = errors.find((e) => e.property === 'status');
    expect(statusError).toBeDefined();
  });

  it('should be invalid without dueDate', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      description: 'Description',
    });

    const errors = await validate(dto);
    const dueDateError = errors.find((e) => e.property === 'dueDate');
    expect(dueDateError).toBeDefined();
  });

  it('should be invalid with non-boolean active value', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      description: 'Description',
      dueDate: new Date(),
      active: 'yes',
    });

    const errors = await validate(dto);
    const activeError = errors.find((e) => e.property === 'active');
    expect(activeError).toBeDefined();
  });

  it('should be valid without optional fields', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      title: 'Task title',
      description: 'Description',
      dueDate: new Date(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
