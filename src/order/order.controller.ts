import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrderService } from './services/order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const data = await this.orderService.findAll(page, limit);
    return { data, message: 'Lista de ordenes obtenidas', success: true };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.orderService.findOne(id);
    return { data, message: 'Orden obtenida', success: true };
  }

  @Post()
  create(@Body() order: CreateOrderDto) {
    const newOrder = this.orderService.create(order);
    return { data: newOrder, message: 'Orden creada', success: true };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() order: UpdateOrderDto) {
    const newOrder = await this.orderService.update(id, order);
    return { data: newOrder, message: 'Orden actualizada', success: true };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const removed = await this.orderService.remove(id);
    return { data: removed, message: 'Orden eliminada', success: true };
  }
}
