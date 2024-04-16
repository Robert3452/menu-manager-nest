import { CreateToppingCategoryDto } from 'src/toppings-category/dto/create-toppings-category.dto';

export interface CreateProductDto {
  index: number;
  name: string;
  content: string;
  image: string;
  realPrice: number;
  corridorId: number;
  toppingCategories?: CreateToppingCategoryDto[];
}
