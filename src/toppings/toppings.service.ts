import { Injectable } from '@nestjs/common';
import { CreateToppingDto } from './dto/create-topping.dto';
import { UpdateToppingDto } from './dto/update-topping.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Topping } from 'src/database/Entity/Topping';
import { IBaseRepository } from 'src/database/IBaseRepository';

@Injectable()
export class ToppingsService {
  baseRepo: IBaseRepository<Topping>;
  constructor(
    @InjectRepository(Topping) private toppingRepo: Repository<Topping>,
  ) {}
  async create(body: CreateToppingDto) {
    const saved = await this.toppingRepo.create({ ...body } as Topping);
    return saved;
  }

  async update(toppingId: number, body: UpdateToppingDto) {
    const updated = await this.toppingRepo.update(toppingId, {
      ...body,
    } as Topping);
    return updated;
  }

  async upsert(arr: Topping[]) {
    const result = await this.toppingRepo.upsert(arr, ['id']);
    return result;
  }

  async getOneById(toppingId: number) {
    const result = await this.toppingRepo.findOne({ where: { id: toppingId } });
    return result;
  }

  async getListByCategoryId(categoryId: number) {
    const result = await this.toppingRepo
      .createQueryBuilder('toppings')
      .innerJoin('toppings.toppingsCategory', 'categories')
      .where('categories.toppings_category_id=:categoryId', { categoryId })
      .getMany();
    return result;
  }

  async delete(toppingId: number) {
    return await this.toppingRepo.delete(toppingId);
  }
}
