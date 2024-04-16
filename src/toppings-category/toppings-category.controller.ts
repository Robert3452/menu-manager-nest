import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ToppingsCategoryService } from './toppings-category.service';
import { CreateToppingCategoryDto } from './dto/create-toppings-category.dto';
import { UpdateToppingCategoryDto } from './dto/update-toppings-category.dto';

@Controller('toppings-category')
export class ToppingsCategoryController {
  constructor(
    private readonly toppingsCategoryService: ToppingsCategoryService,
  ) {}

  @Post()
  create(@Body() createToppingsCategoryDto: CreateToppingCategoryDto) {
    return this.toppingsCategoryService.create(createToppingsCategoryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toppingsCategoryService.getById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateToppingsCategoryDto: UpdateToppingCategoryDto,
  ) {
    return this.toppingsCategoryService.update(+id, updateToppingsCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toppingsCategoryService.delete(+id);
  }
}
