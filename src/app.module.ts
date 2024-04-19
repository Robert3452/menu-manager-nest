import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './Interceptors/transform.interceptor';
import { S3ClientModule } from './s3-client/s3-client.module';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import { MenuModule } from './menu/menu.module';
import { BranchesModule } from './branches/branches.module';
import { StoresModule } from './stores/stores.module';
import { BranchInfoModule } from './branch-info/branch-info.module';
import config from './config';

@Module({
  imports: [
    DatabaseModule,
    S3ClientModule,
    ConfigModule.forRoot({
      envFilePath: join(resolve(), '/.env'),
      isGlobal: true,
      load: [config],
    }),
    MenuModule,
    BranchesModule,
    StoresModule,
    BranchInfoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
