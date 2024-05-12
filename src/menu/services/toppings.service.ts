import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import { Topping } from 'src/database/Entity/Topping';
import { Repository } from 'typeorm';
import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';

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

  async upsert(body: UpdateToppingDto[]) {
    const upsertPromises = body.map(async (el) => {
      try {
        const found = await this.repo.findOneById(el?.id);
        if (el.remove) {
          await this.repo.delete(el.id);
        }
        if (!found || !el?.id) {
          const created = await this.repo.create({
            ...el,
          } as Topping);
          return created;
        } else {
          const updated = await this.repo.update(el?.id, { ...el } as Topping);
          return updated;
        }
      } catch (error) {
        return;
      }
    });
    const toppings = await Promise.all(upsertPromises);
    // const result = await this.repo.baseRepository.upsert(arr, ["'toppingId'"]);
    return toppings;
    // return result;
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
