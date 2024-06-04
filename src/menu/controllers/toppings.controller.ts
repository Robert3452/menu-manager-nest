import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ToppingsService } from '../services/toppings.service';
import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('toppings')
export class ToppingsController {
  constructor(private toppingService: ToppingsService) {}

  @Post()
  async createTopping(@Body() body: CreateToppingDto) {
    const data = await this.toppingService.create(body);
    return {
      data,
      success: true,
      message: 'Topping created successfully',
    };
  }

  @Put(':toppingId')
  async updateTopping(
    @Body() body: UpdateToppingDto,
    @Param('toppingId') toppingId: string,
  ) {
    const data = await this.toppingService.update(+toppingId, body);
    return {
      data,
      success: true,
      message: 'Topping updated successfully',
    };
  }

  @Delete(':toppingId')
  async deleteTopping(@Param('toppingId') toppingId: string) {
    const data = await this.toppingService.delete(+toppingId);
    return {
      data,
      success: true,
      message: 'Topping deleted successfully',
    };
  }
}
