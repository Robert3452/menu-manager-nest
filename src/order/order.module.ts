import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
