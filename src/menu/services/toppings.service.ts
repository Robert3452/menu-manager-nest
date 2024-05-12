import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import { Topping } from 'src/database/Entity/Topping';
import { Repository } from 'typeorm';
import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';
import { ToppingsCategory } from 'src/database/Entity/ToppingCategories';

@Injectable()
export class ToppingsService {
  repo: BaseRepository<Topping>;
  constructor(
    @InjectRepository(Topping) private toppingRepo: Repository<Topping>,
  ) {
    this.repo = new BaseRepository(toppingRepo);
  }
  async create(body: CreateToppingDto) {
    const saved = await this.repo.create({ ...body } as Topping);
    return saved;
  }

  async update(toppingId: number, body: UpdateToppingDto) {
    const updated = await this.repo.update(toppingId, {
      ...body,
    } as Topping);
    return updated;
  }

  async upsert(
    toppings: UpdateToppingDto[],
    category: ToppingsCategory,
  ): Promise<Topping[]> {
    const upsertPromises = toppings.map(async (item): Promise<Topping> => {
      try {
        const topping = {
          ...item,
          toppingCategoryId: category.id,
        } as UpdateToppingDto;
        let currTopping: Topping;
        const found = await this.repo.findOneById(topping?.id);
        if (found && topping.remove) {
          await this.repo.delete(topping.id);
          return null;
        }
        if (!found || !topping?.id) {
          currTopping = await this.repo.create({ ...topping } as Topping);
        } else {
          currTopping = await this.repo.update(topping?.id, {
            ...topping,
          } as Topping);
        }
        return currTopping;
      } catch (error) {
        throw error;
      }
    });
    const arrToppings = await Promise.all(upsertPromises);
    return arrToppings.filter((el) => el);
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

  async getOneById(toppingId: number) {
    const result = await this.repo.findOneById(toppingId);
    return result;
  }

  async getListByCategoryId(categoryId: number) {
    const result = await this.repo
      .createQueryBuilder('toppings')
      .innerJoin('toppings.toppingsCategory', 'categories')
      .where('categories.toppings_category_id=:categoryId', { categoryId })
      .getMany();
    return result;
  }

  async delete(toppingId: number) {
    return await this.repo.delete(toppingId);
  }
}
