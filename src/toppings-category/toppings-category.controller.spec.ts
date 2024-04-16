import { Test, TestingModule } from '@nestjs/testing';
import { ToppingsCategoryController } from './toppings-category.controller';
import { ToppingsCategoryService } from './toppings-category.service';

describe('ToppingsCategoryController', () => {
  let controller: ToppingsCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToppingsCategoryController],
      providers: [ToppingsCategoryService],
    }).compile();

    controller = module.get<ToppingsCategoryController>(
      ToppingsCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
