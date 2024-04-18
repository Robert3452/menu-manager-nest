import { PartialType } from '@nestjs/swagger';
import { CreateToppingCategoryDto } from './create-toppings-category.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateToppingCategoryDto extends PartialType(
  CreateToppingCategoryDto,
) {
  @IsOptional()
  @IsNumber()
  id?: number;
}
