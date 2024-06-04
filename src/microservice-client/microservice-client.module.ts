import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import config from 'src/config';

const microServiceFactory = {
  provide: 'AUTH_SERVICE',
  inject: [config.KEY],
  useFactory: (configService: ConfigType<typeof config>) => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        port: +configService.microservicePort,
      },
    });
  },
};
@Global()
@Module({
  providers: [microServiceFactory],
  exports: ['AUTH_SERVICE'],
})
export class MicroserviceModule {}
