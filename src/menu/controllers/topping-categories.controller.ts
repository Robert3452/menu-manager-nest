import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateToppingCategoryDto } from '../dto/create-toppings-category.dto';
import { ToppingsCategoryService } from '../services/toppings-category.service';
import { UpdateToppingCategoryDto } from '../dto/update-toppings-category.dto';
import { ToppingsService } from '../services/toppings.service';

@Controller('topping-categories')
export class ToppingCategoriesController {
  constructor(
    private toppingCategoryService: ToppingsCategoryService,
    private toppingService: ToppingsService,
  ) {}

  @Get(':categoryId')
  async getToppingsByCategroy(@Param('categoryId') categoryId: string) {
    return this.toppingService.getListByCategoryId(+categoryId);
  }
  @Post()
  async createToppingCategory(@Body() body: CreateToppingCategoryDto) {
    return this.toppingCategoryService.create(body);
  }

  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateToppingCategoryDto,
  ) {
    return this.toppingCategoryService.update(+categoryId, body);
  }

  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string) {
    return this.toppingCategoryService.delete(+categoryId);
  }
}
