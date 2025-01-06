import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/database/Entity/OrderItem';
import { Repository } from 'typeorm';
import {
  CreateOrderItemDto,
  UpsertOrderItemDto,
} from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';
import { OrderItemToppingService } from './order-item-topping.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly orderItemToppingService: OrderItemToppingService,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    return this.orderItemRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find();
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id } });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return orderItem;
  }
  async upsert(createOrderItemDto: UpsertOrderItemDto): Promise<OrderItem> {
    const existingOrderItem = await this.orderItemRepository.findOne({
      where: { id: createOrderItemDto.id },
    });
    const { toppings } = createOrderItemDto;

    const storedToppings = await Promise.all(
      toppings.map((el) => this.orderItemToppingService.upsert(el)),
    );
    createOrderItemDto.toppings = storedToppings;
    if (existingOrderItem) {
      const { id, ...item } = createOrderItemDto;
      await this.orderItemRepository.update(id, item);
      return this.orderItemRepository.findOne({
        where: { id: createOrderItemDto.id },
      });
    } else {
      const newOrderItem = this.orderItemRepository.create(createOrderItemDto);
      return this.orderItemRepository.save(newOrderItem);
    }
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    await this.orderItemRepository.update(id, updateOrderItemDto);
    const updatedOrderItem = await this.orderItemRepository.findOne({
      where: { id },
    });
    if (!updatedOrderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return updatedOrderItem;
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
  }
}
