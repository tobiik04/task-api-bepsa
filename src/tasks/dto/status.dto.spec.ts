import { plainToInstance } from 'class-transformer';
import { StatusDTO } from './status.dto';
import { validate } from 'class-validator';

describe('StatusDTO', () => {
  it('should be valid with correct data', async () => {
    const dto = plainToInstance(StatusDTO, {
      status: 'CANCELLED',
    });

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail with invalid data', async () => {
    const dto = plainToInstance(StatusDTO, {
      status: 'REJECTED',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
