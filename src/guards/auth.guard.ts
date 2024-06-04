import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextController = context.getClass().name;
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
