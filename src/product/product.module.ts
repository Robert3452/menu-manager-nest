import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ToppingsCategoryService } from 'src/toppings-category/toppings-category.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [ToppingsCategoryService],
})
export class ProductModule {}
