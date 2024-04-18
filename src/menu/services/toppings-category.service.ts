import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from 'src/database/Entity/Topping';
import { ToppingsCategory } from 'src/database/Entity/ToppingsCategories';
import { Repository } from 'typeorm';
import { UpdateToppingCategoryDto } from '../dto/update-toppings-category.dto';
import { CreateToppingCategoryDto } from '../dto/create-toppings-category.dto';
import { ToppingsService } from 'src/menu/services/toppings.service';
import { Product } from 'src/database/Entity/Product';

@Injectable()
export class ToppingsCategoryService {
  constructor(
    @InjectRepository(ToppingsCategory)
    private toppingCatRepo: Repository<ToppingsCategory>,
    private toppingService: ToppingsService,
  ) {}
  async create(body: CreateToppingCategoryDto) {
    const { toppings, ...rest } = body;

    const results = await Promise.all(
      toppings.map((topping) => this.toppingService.create(topping)),
    );
    const saved = await this.toppingCatRepo.create({
      ...rest,
      toppings: results,
    } as ToppingsCategory);
    return saved;
  }

  async delete(id: number) {
    const deleted = await this.toppingCatRepo.delete(id);
    return deleted;
  }

  async update(id: number, body: UpdateToppingCategoryDto) {
    const { toppings, ...rest } = body;
    if (toppings && toppings.length > 0) {
      const toppingsCategory = await this.toppingCatRepo.findOne({
        where: { id },
      });
      await this.toppingService.upsert(
        toppings.map((el) => ({ ...el, toppingsCategory }) as Topping),
      );
    }
    const result = await this.toppingCatRepo.update(id, {
      ...rest,
    } as ToppingsCategory);

    return result;
  }

  async upsert(body: UpdateToppingCategoryDto[], product: Product) {
    const result = await this.toppingCatRepo.upsert(
      body.map((el) => ({ ...el, product })),
      ['title'],
    );

    const mapCategories = result.generatedMaps.reduce(
      (prev: number[], curr) => {
        return [...prev, curr.id];
      },
      [] as number[],
    );

    await Promise.all(
      body.map((category, index) => {
        if (category.toppings && category.toppings.length > 0) {
          return this.toppingService.upsert(
            category.toppings.map(
              (topping) =>
                ({
                  ...topping,
                  toppingCategoryId: mapCategories[index],
                }) as Topping,
            ),
          );
        }
      }),
    );
  }

  async getById(id: number) {
    const result = await this.toppingCatRepo
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('categories.toppings_category_id=:id', { id })
      .getOne();
    return result;
  }

  async getCategoriesByProductId(id: number) {
    const result = await this.toppingCatRepo
      .createQueryBuilder('categories')
      .innerJoin('categories.product', 'product')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('product.productId=:id', { id })
      .getMany();
    return result;
  }
}
