import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AUTH_EVENT } from '../decorator/auth.decorator';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_SERVICE') private client: ClientProxy,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const authEvent = this.reflector.get<boolean>(
      AUTH_EVENT,
      context.getHandler(),
    );
    if (!authEvent) {
      return next.handle();
    }
    const contextController = context.getClass().name;
    const contextMethodName = context.getHandler().name;
    const token = '';
    const pattern = 'auth'; //previous log
    // const request = context.switchToHttp().getRequest();
    // const pattern = 'log';
    // const data = {
    //   method: request.method,
    //   path: request.path,
    //   timestamp: new Date().toISOString(),
    // };

    return next.handle().pipe(
      tap(() => {
        this.client.emit(pattern, {
          token,
          method: `${contextController}#${contextMethodName}`,
        });
      }),
    );
  }
}
