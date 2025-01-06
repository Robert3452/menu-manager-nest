import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsPhoneNumber(null)
  customerPhone: string;

  @IsDate()
  orderDate: Date;

  @IsNumber()
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  products: CreateOrderItemDto[];
}
