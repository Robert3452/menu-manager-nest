import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { ToppingType } from 'src/database/Entity/Enum/ToppingTypeEnum';
import { CreateToppingDto } from 'src/menu/dto/create-topping.dto';

export class CreateToppingCategoryDto {
  @IsString()
  title: string;
  @IsString()
  subtitle?: string;
  @IsNumber()
  minToppingsForCategory: number;

  @IsNumber()
  maxToppingsForCategory: number;

  @IsEnum(ToppingType)
  toppingType: ToppingType;

  @IsNumber()
  index: number;
  @IsArray()
  @Type(() => CreateToppingDto)
  toppings: CreateToppingDto[];
}
