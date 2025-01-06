import { Type } from 'class-transformer';
import { IsArray, IsDecimal, IsInt, ValidateNested } from 'class-validator';
import { CreateOrderItemToppingDto } from './create-order-item-topping.dto';
import { PartialType } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsInt()
  orderId: number;
  @IsInt()
  productId: number;
  @IsInt()
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemToppingDto)
  toppings: CreateOrderItemToppingDto[];
  @IsDecimal()
  price: number;
}

export class UpsertOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsInt()
  id?: number;
}
