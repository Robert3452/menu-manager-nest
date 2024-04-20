import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './typeorm';
import { Address } from './Entity/Address';
import { Branch } from './Entity/Branch';
import { Corridor } from './Entity/Corridor';
import { Product } from './Entity/Product';
import { Schedule } from './Entity/Schedule';
import { Store } from './Entity/Store';
import { Tag } from './Entity/Tag';
import { Topping } from './Entity/Topping';
import { ToppingsCategory } from './Entity/ToppingsCategories';
import { Weekday } from './Entity/Weekday';
import { WeekdaySchedule } from './Entity/WeekDaySchedule';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([
      Address,
      Branch,
      Corridor,
      Product,
      Schedule,
      Store,
      Tag,
      Topping,
      ToppingsCategory,
      Weekday,
      WeekdaySchedule,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
