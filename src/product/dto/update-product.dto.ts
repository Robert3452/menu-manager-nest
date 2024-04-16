import { UpdateToppingCategoryDto } from 'src/toppings-category/dto/update-toppings-category.dto';
import { CreateProductDto } from './create-product.dto';
type CreateProduct = Omit<CreateProductDto, 'toppingCategories'>;

export interface UpdateProductDto extends Partial<CreateProduct> {
  id?: number;
  toppingCategories?: UpdateToppingCategoryDto[];
}
