import { CreateToppingCategoryDto } from './create-toppings-category.dto';

export interface UpdateToppingCategoryDto
  extends Partial<CreateToppingCategoryDto> {
  id?: number;
}
