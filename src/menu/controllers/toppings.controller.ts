import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ToppingsService } from '../services/toppings.service';
import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';

@Controller('toppings')
export class ToppingsController {
  constructor(private toppingService: ToppingsService) {}

  @Post()
  async createTopping(@Body() body: CreateToppingDto) {
    return this.toppingService.create(body);
  }

  @Put(':toppingId')
  async updateTopping(
    @Body() body: UpdateToppingDto,
    @Param('toppingId') toppingId: string,
  ) {
    return this.toppingService.update(+toppingId, body);
  }

  @Delete(':toppingId')
  async deleteTopping(@Param('toppingId') toppingId: string) {
    return this.toppingService.delete(+toppingId);
  }
}
