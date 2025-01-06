import { PartialType } from '@nestjs/swagger';
import { IsDecimal, IsInt, IsOptional } from 'class-validator';

export class CreateOrderItemToppingDto {
  @IsInt()
  orderItemId?: number;
  @IsInt()
  toppingId: number;
  @IsInt()
  quantity: number;
  @IsDecimal()
  price: number;
}

export class UpsertOrderItemToppingDto extends PartialType(
  CreateOrderItemToppingDto,
) {
  @IsOptional()
  @IsInt()
  id?: number;
}
