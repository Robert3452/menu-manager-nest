import { HttpService } from '@nestjs/axios';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { lastValueFrom } from 'rxjs';
import config from 'src/config';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly httpService: HttpService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextController = context.getClass().name;
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const contextMethodName = context.getHandler().name;

    const authManagerUri = this.configService.microserviceHost;
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const {
      data: { isAuth, payload },
    } = await lastValueFrom(
      this.httpService.get(`${authManagerUri}/auth/auth-me`, {
        headers: {
          Authorization: authHeader,
          method: `${contextController}#${contextMethodName}`,
        },
      }),
    );

    if (isAuth) request.user = payload;
    return isAuth;
  }
}
