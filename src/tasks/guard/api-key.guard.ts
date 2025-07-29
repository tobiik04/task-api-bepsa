import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { envs } from '../../config/envs';

export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const envApikey = envs.apiKey;
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing');

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer')
      throw new UnauthorizedException('API key must be a Bearer Token');

    if (!token) throw new UnauthorizedException(`Missing API key`);

    if (token !== envApikey) throw new UnauthorizedException('Invalid API key');

    return true;
  }
}
