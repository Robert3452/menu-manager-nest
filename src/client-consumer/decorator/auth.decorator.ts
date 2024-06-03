import { SetMetadata } from '@nestjs/common';
export const AUTH_EVENT = 'authEvent';

export const AuthEvent = () => SetMetadata(AUTH_EVENT, true);
