import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, DiscoveryModule } from '@nestjs/core';
import { join, resolve } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BranchInfoModule } from './branch-info/branch-info.module';
import config from './config';
import { DatabaseModule } from './database/database.module';
import { AppDiscoveryService } from './discovery.service';
import { TransformInterceptor } from './Interceptors/transform.interceptor';
import { MenuModule } from './menu/menu.module';
import { S3ClientModule } from './s3-client/s3-client.module';
import { StoresModule } from './stores/stores.module';
import { OrderModule } from './order/order.module';

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
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // microServiceFactory,
    AppDiscoveryService,
  ],
  // exports: [microServiceFactory],
})
export class AppModule {}
