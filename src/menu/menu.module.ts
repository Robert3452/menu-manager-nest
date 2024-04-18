import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { ProductService } from './services/product.service';
import { ToppingsCategoryService } from './services/toppings-category.service';
import { ToppingsService } from './services/toppings.service';
import { CorridorsService } from './services/corridors.service';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [StoresModule],
  controllers: [MenuController],
  providers: [
    ProductService,
    ToppingsService,
    ToppingsCategoryService,
    CorridorsService,
  ],
})
export class MenuModule {}
