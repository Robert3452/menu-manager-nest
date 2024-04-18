import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { CreateToppingCategoryDto } from 'src/menu/dto/create-toppings-category.dto';

export class CreateProductDto {
  @IsNumber()
  index: number;
  @IsString()
  name: string;
  @IsString()
  content: string;
  @IsString()
  image: string;
  @IsNumber()
  realPrice: number;
  @IsNumber()
  corridorId: number;
  @Type(() => CreateToppingCategoryDto)
  toppingCategories?: CreateToppingCategoryDto[];
}
