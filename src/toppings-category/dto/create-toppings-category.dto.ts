import { ToppingType } from 'src/database/Entity/Enum/ToppingTypeEnum';
import { CreateToppingDto } from 'src/toppings/dto/create-topping.dto';

export interface CreateToppingCategoryDto {
  title: string;
  subtitle?: string;
  minToppingsForCategory: number;
  maxToppingsForCategory: number;
  toppingType: ToppingType;
  index: number;
  toppings: CreateToppingDto[];
}
