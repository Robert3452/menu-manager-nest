import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateToppingCategoryDto } from 'src/menu/dto/update-toppings-category.dto';
class CreateProduct extends OmitType(CreateProductDto, ['toppingCategories']) {}

export class UpdateProductDto extends PartialType(CreateProduct) {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsArray()
  @IsOptional()
  @Type(() => UpdateToppingCategoryDto)
  toppingCategories?: UpdateToppingCategoryDto[];
}
