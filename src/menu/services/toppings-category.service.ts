import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from 'src/database/Entity/Topping';
import { ToppingsCategory } from 'src/database/Entity/ToppingCategories';
import { Repository } from 'typeorm';
import { UpdateToppingCategoryDto } from '../dto/update-toppings-category.dto';
import { CreateToppingCategoryDto } from '../dto/create-toppings-category.dto';
import { ToppingsService } from 'src/menu/services/toppings.service';
import { Product } from 'src/database/Entity/Product';
import { BaseRepository } from 'src/database/BaseRepository';

@Injectable()
export class ToppingsCategoryService {
  repo: BaseRepository<ToppingsCategory>;
  constructor(
    @InjectRepository(ToppingsCategory)
    private toppingCatRepo: Repository<ToppingsCategory>,
    private toppingService: ToppingsService,
  ) {
    this.repo = new BaseRepository(toppingCatRepo);
  }
  async create(body: CreateToppingCategoryDto) {
    const { toppings, ...rest } = body;

    const results = await Promise.all(
      toppings.map((topping) => this.toppingService.create(topping)),
    );
    const saved = await this.repo.create({
      ...rest,
      toppings: results,
    } as ToppingsCategory);
    return saved;
  }

  async delete(id: number) {
    const deleted = await this.repo.delete(id);
    return deleted;
  }

  async bulkDelete(ids: number[]) {
    const promisesFound = await ids.map(
      async (id: number) => await this.repo.findOneById(id),
    );
    const results = await Promise.all(promisesFound);
    const founds = results.filter((el) => el);
    const promises = await founds.map(
      async (el) => await this.repo.delete(el.id),
    );
    const deleted = await Promise.all(promises);
    return deleted;
  }

  async update(id: number, body: UpdateToppingCategoryDto) {
    const { toppings, ...rest } = body;
    if (toppings && toppings.length > 0) {
      const toppingsCategory = await this.repo.findOneById(id);
      await this.toppingService.upsert(
        toppings.map((el) => ({ ...el, toppingsCategory }) as Topping),
      );
    }
    const result = await this.repo.update(id, {
      ...rest,
    } as ToppingsCategory);

    return result;
  }

  async upsert(body: UpdateToppingCategoryDto[], product: Product) {
    const upsertPromises = body.map(async (category) => {
      const found = await this.repo.findOneById(category?.id);
      // If remove is true, remove it.
      if (category.remove) {
        await this.delete(category.id);
      }
      // if category not found, create it
      if (!found || !category?.id) {
        const created = await this.repo.create({
          ...category,
          product,
        } as ToppingsCategory);
        const upsertToppings = await this.toppingService.upsert([
          ...category.toppings.map(
            (topping) =>
              ({
                ...topping,
                toppingCategoryId: created.id,
                toppingsCategory: created,
              }) as Topping,
          ),
        ] as Topping[]);
        return { ...created, toppings: upsertToppings };
        // else update it
      } else {
        const updated = await this.repo.update(category?.id, {
          ...category,
          product,
        } as ToppingsCategory);
        const upsertToppings = await this.toppingService.upsert([
          ...category.toppings.map(
            (topping) =>
              ({
                ...topping,
                toppingCategoryId: updated.id,
                toppingsCategory: updated,
              }) as Topping,
          ),
        ] as Topping[]);
        return { ...updated, toppings: upsertToppings };
      }
    });
    const categories = await Promise.all(upsertPromises);
    return categories;
  }

  async getById(id: number) {
    const result = await this.repo
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('categories.toppings_category_id=:id', { id })
      .getOne();
    return result;
  }

  async getCategoriesByProductId(id: number) {
    const result = await this.repo
      .createQueryBuilder('categories')
      .innerJoin('categories.product', 'product')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('product.productId=:id', { id })
      .getMany();
    return result;
  }
}
