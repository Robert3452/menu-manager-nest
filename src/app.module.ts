import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR, DiscoveryModule } from '@nestjs/core';
import { TransformInterceptor } from './Interceptors/transform.interceptor';
import { S3ClientModule } from './s3-client/s3-client.module';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import { MenuModule } from './menu/menu.module';
import { StoresModule } from './stores/stores.module';
import { BranchInfoModule } from './branch-info/branch-info.module';
import config from './config';
import { AppDiscoveryService } from './discovery.service';
import { ClientConsumerModule } from './client-consumer/client-consumer.module';

@Module({
  imports: [
    DatabaseModule,
    DiscoveryModule,
    ConfigModule.forRoot({
      envFilePath: join(resolve(), '/.env'),
      isGlobal: true,
      load: [config],
    }),
    S3ClientModule,
    MenuModule,
    StoresModule,
    BranchInfoModule,
    ClientConsumerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    AppDiscoveryService,
  ],
})
export class AppModule {}
