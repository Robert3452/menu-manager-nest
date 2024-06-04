import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextController = context.getClass().name;
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const contextMethodName = context.getHandler().name;

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const authHeaderParts = (authHeader as string).split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    const isAuth = await lastValueFrom(
      this.authService.send(
        { cmd: 'auth' },
        {
          jwt,
          method: `${contextController}#${contextMethodName}`,
        },
      ),
    );

    return isAuth;
  }
}
