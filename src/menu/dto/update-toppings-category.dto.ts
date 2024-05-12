import { PartialType } from '@nestjs/swagger';
import { CreateToppingCategoryDto } from './create-toppings-category.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateToppingCategoryDto extends PartialType(
  CreateToppingCategoryDto,
) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
