import { Injectable } from '@nestjs/common';
import { OrderItemTopping } from 'src/database/Entity/OrderItemTopping';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import {
  CreateOrderItemToppingDto,
  UpsertOrderItemToppingDto,
} from '../dto/create-order-item-topping.dto';
import { UpdateOrderItemToppingDto } from '../dto/update-order-item-topping.dto';
@Injectable()
export class OrderItemToppingService {
  orderItemToppingRepo: BaseRepository<OrderItemTopping>;
  constructor(
    @InjectRepository(OrderItemTopping)
    private readonly orderItemToppingRepository: Repository<OrderItemTopping>,
  ) {
    this.orderItemToppingRepo = new BaseRepository(orderItemToppingRepository);
  }

  async create(
    orderItemTopping: CreateOrderItemToppingDto,
  ): Promise<OrderItemTopping> {
    return this.orderItemToppingRepo.create({
      ...orderItemTopping,
    } as OrderItemTopping);
  }
  async upsert(
    orderItemTopping: UpsertOrderItemToppingDto,
  ): Promise<OrderItemTopping> {
    const existingTopping = await this.orderItemToppingRepo.findOneById(
      orderItemTopping.id,
    );

    if (existingTopping) {
      const { id, ...item } = orderItemTopping;
      await this.orderItemToppingRepo.update(id, {
        ...item,
      } as OrderItemTopping);
      return this.orderItemToppingRepo.findOneById(existingTopping.id);
    } else {
      return this.orderItemToppingRepo.create({
        ...orderItemTopping,
      } as OrderItemTopping);
    }
  }

  async update(
    id: number,
    orderItemTopping: UpdateOrderItemToppingDto,
  ): Promise<void> {
    await this.orderItemToppingRepo.update(id, {
      ...orderItemTopping,
    } as OrderItemTopping);
  }

  async remove(id: number): Promise<void> {
    await this.orderItemToppingRepo.delete(id);
  }
}
