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
import { ToppingsCategory } from './Entity/ToppingCategories';
import { Weekday } from './Entity/Weekday';
import { WeekdaySchedule } from './Entity/WeekDaySchedule';
import { StoreHasUsers } from './Entity/StoreHasUsers';
import { LandingPage } from './Entity/LandingPage';
import { Order } from './Entity/Order';
import { OrderItem } from './Entity/OrderItem';
import { OrderItemTopping } from './Entity/OrderItemTopping';
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
      LandingPage,
      Product,
      Schedule,
      Store,
      Tag,
      Topping,
      ToppingsCategory,
      Weekday,
      WeekdaySchedule,
      StoreHasUsers,
      Order,
      OrderItem,
      OrderItemTopping,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
