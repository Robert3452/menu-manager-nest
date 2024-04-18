import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateToppingDto {
  @IsBoolean()
  available: boolean;
  @IsString()
  title: string;
  @IsNumber()
  price: number;
  @IsBoolean()
  required: boolean;
  @IsNumber()
  index: number;
  @IsNumber()
  maxLimit: number;
}
