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

  async upsert(arr: Topping[]) {
    const result = await this.repo.baseRepository.upsert(arr, ['id']);
    return result;
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
