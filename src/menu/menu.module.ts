import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ToppingsCategoryService } from './services/toppings-category.service';
import { ToppingsService } from './services/toppings.service';
import { CorridorsService } from './services/corridors.service';
import { StoresModule } from 'src/stores/stores.module';
import { CorridorsController } from './controllers/corridors.controller';
import { ProductsController } from './controllers/products.controller';
import { ToppingCategoriesController } from './controllers/topping-categories.controller';
import { ToppingsController } from './controllers/toppings.controller';

@Module({
  imports: [StoresModule],
  controllers: [
    CorridorsController,
    ProductsController,
    ToppingCategoriesController,
    ToppingsController,
  ],
  providers: [
    ProductService,
    ToppingsService,
    ToppingsCategoryService,
    CorridorsService,
  ],
})
export class MenuModule {}
