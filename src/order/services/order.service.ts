import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import { Order } from 'src/database/Entity/Order';
import { Repository } from 'typeorm';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItemService } from './order-item.service';

@Injectable()
export class OrderService {
  orderRepo: BaseRepository<Order>;
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private orderItemService: OrderItemService,
  ) {
    this.orderRepo = new BaseRepository(ordersRepository);
  }
  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Order[]; count: number }> {
    const [data, count] = await this.ordersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findAllWithRelations(
    page: number,
    limit: number,
  ): Promise<{ data: Order[]; count: number }> {
    const [data, count] = await this.ordersRepository.findAndCount({
      // relations: ['orderItems', 'orderItems.orderItemToppings'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }
  async findOne(id: number): Promise<Order> {
    return this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.orderItemToppings', 'orderItemTopping')
      .where('order.id = :id', { id })
      .getOne();
  }

  async create(order: CreateOrderDto): Promise<Order> {
    const { products: orderItems } = order;
    const savedOrderItems = [];
    for (const item of orderItems) {
      const savedItem = await this.orderItemService.upsert(item);
      savedOrderItems.push(savedItem);
    }
    return this.orderRepo.create({
      ...order,
      id: 0,
      orderItems: savedOrderItems,
    } as Order);
  }

  async update(id: number, order: UpdateOrderDto): Promise<void> {
    const { products: orderItems } = order;
    const savedOrderItems = [];
    for (const item of orderItems) {
      const savedItem = await this.orderItemService.upsert(item);
      savedOrderItems.push(savedItem);
    }
    await this.ordersRepository.update(id, {
      ...order,
      orderItems: savedOrderItems,
    });
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }
}
