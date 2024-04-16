import { Test, TestingModule } from '@nestjs/testing';
import { ToppingsCategoryService } from './toppings-category.service';

describe('ToppingsCategoryService', () => {
  let service: ToppingsCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToppingsCategoryService],
    }).compile();

    service = module.get<ToppingsCategoryService>(ToppingsCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
