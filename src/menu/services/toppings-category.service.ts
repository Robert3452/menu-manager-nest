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
        toppingsCategory,
      );
    }
    const result = await this.repo.update(id, {
      ...rest,
    } as ToppingsCategory);

    return result;
  }

  async upsert(
    body: UpdateToppingCategoryDto[],
    product: Product,
  ): Promise<ToppingsCategory[]> {
    const upsertPromises = body.map(
      async (category): Promise<UpdateToppingCategoryDto> => {
        let currCategory: ToppingsCategory;
        const found = await this.repo.findOneById(category?.id);
        // If remove is true, remove it.
        if (found && category.remove) {
          await this.delete(category.id);
          return null;
        }
        // if category not found, create it
        if (!found || !category?.id) {
          currCategory = await this.repo.create({
            ...category,
            productId: product.id,
          } as ToppingsCategory);
          // else update it
        } else {
          currCategory = await this.repo.update(category?.id, {
            ...category,
            product,
          } as ToppingsCategory);
        }
        return { ...currCategory, toppings: category.toppings };
        // upsert the toppings inside the array
      },
    );
    const categories = await Promise.all(upsertPromises);
    const categoriesPromise = categories
      .filter((el) => el)
      .map(async (category): Promise<ToppingsCategory> => {
        const toppings = await this.toppingService.upsert(category.toppings, {
          ...category,
        } as ToppingsCategory);
        return { ...category, toppings } as ToppingsCategory;
      });
    const currCategories = await Promise.all(categoriesPromise);
    return currCategories;
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
