import { Module } from '@nestjs/common';
import { ToppingsCategoryService } from './toppings-category.service';
import { ToppingsCategoryController } from './toppings-category.controller';
import { ToppingsService } from 'src/toppings/toppings.service';

@Module({
  controllers: [ToppingsCategoryController],
  providers: [ToppingsCategoryService],
  imports: [ToppingsService],
})
export class ToppingsCategoryModule {}
