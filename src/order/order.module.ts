import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './order.controller';
import { OrderItemService } from './services/order-item.service';
import { OrderItemToppingService } from './services/order-item-topping.service';

@Module({
  imports: [],
  providers: [OrderService, OrderItemService, OrderItemToppingService],
  controllers: [OrderController],
})
export class OrderModule {}
