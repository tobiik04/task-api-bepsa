jest.mock('../../config/envs', () => ({
  envs: {
    apiKey: 'valid-key',
  },
}));

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(() => {
    guard = new ApiKeyGuard();
  });

  function mockExecutionContext(authHeader?: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
    } as any; // no encontré forma de mockear el ExecutionContext sin any
  }

  it('should throw UnauthorizedException if authorization header is missing', () => {
    const context = mockExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrowError(
      UnauthorizedException,
    );
    expect(() => guard.canActivate(context)).toThrow(
      'Authorization header is missing',
    );
  });

  it('should throw UnauthorizedException if authorization type is not Bearer', () => {
    const context = mockExecutionContext('Basic sometoken');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow(
      'API key must be a Bearer Token',
    );
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const context = mockExecutionContext('Bearer');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Missing API key');
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    const context = mockExecutionContext('Bearer wrong token');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
    expect(() => guard.canActivate(context)).toThrow('Invalid API key');
  });

  it('should return true if API key is valid', () => {
    const context = mockExecutionContext('Bearer valid-key');
    expect(guard.canActivate(context)).toBe(true);
  });
});
