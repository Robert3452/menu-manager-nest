import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemToppingDto } from './create-order-item-topping.dto';

export class UpdateOrderItemToppingDto extends PartialType(
  CreateOrderItemToppingDto,
) {}
