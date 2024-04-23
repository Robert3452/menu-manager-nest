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
    const data = await this.toppingService.getListByCategoryId(+categoryId);
    return {
      data,
      message: 'topping category view',
      success: true,
    };
  }
  @Post()
  async createToppingCategory(@Body() body: CreateToppingCategoryDto) {
    const data = await this.toppingCategoryService.create(body);
    return {
      data,
      message: 'Topping cateogry saved',
      success: true,
    };
  }

  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateToppingCategoryDto,
  ) {
    const data = await this.toppingCategoryService.update(+categoryId, body);
    return {
      success: true,
      message: 'Topping Category updated successfully',
      data,
    };
  }

  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string) {
    const data = await this.toppingCategoryService.delete(+categoryId);
    return {
      success: true,
      message: 'Topping Category deleted successfully',
      data,
    };
  }
}
