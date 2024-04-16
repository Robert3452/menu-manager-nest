import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './Interceptors/transform.interceptor';
import { ToppingsModule } from './toppings/toppings.module';
import { ToppingsCategoryModule } from './toppings-category/toppings-category.module';
import { ProductModule } from './product/product.module';
import { S3ClientModule } from './s3-client/s3-client.module';
import { ConfigModule } from '@nestjs/config';
import { join, resolve } from 'path';
import config from './config';

@Module({
  imports: [
    DatabaseModule,
    ToppingsModule,
    ToppingsCategoryModule,
    ProductModule,
    S3ClientModule,
    ConfigModule.forRoot({
      envFilePath: join(resolve(), '/.env'),
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
