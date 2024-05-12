// import { PartialType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateToppingDto } from './create-topping.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateToppingDto extends PartialType(CreateToppingDto) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsBoolean()
  remove?: boolean;
}
