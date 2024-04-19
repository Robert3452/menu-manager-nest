import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CorridorsService } from 'src/menu/services/corridors.service';
import { CreateCorridorDto } from 'src/menu/dto/create-corridor.dto';
import { UpdateCorridorDto } from 'src/menu/dto/update-corridor.dto';
import { RemoveCorridorDto } from 'src/menu/dto/remove-corridor.dto';
import { AddCorridorDto } from 'src/menu/dto/add-corridor.dto';
import { ProductService } from 'src/menu/services/product.service';

@Controller('corridors')
export class CorridorsController {
  constructor(
    private corridorService: CorridorsService,
    private productService: ProductService,
  ) {}

  @Get(':corridorId')
  async getCorridorById(@Param('corridorId') corridorId: string) {
    return this.corridorService.getCorridorById(+corridorId);
  }

  @Post()
  async createCorridor(@Body() body: CreateCorridorDto) {
    return this.corridorService.createCorridor(body);
  }

  @Put(':corridorId')
  async updateCorridor(
    @Param('corridorId') corridorId: string,
    @Body() body: UpdateCorridorDto,
  ) {
    return this.corridorService.updateCorridor(+corridorId, body);
  }

  @Delete(':corridorId')
  async deleteCorridor(@Param('corridorId') corridorId: string) {
    return this.corridorService.deleteCorridor(+corridorId);
  }

  @Put('remove')
  async removeCorridor(@Query() query: RemoveCorridorDto) {
    const { branchId, corridorId } = query;
    return this.corridorService.removeCorridorToBranch(corridorId, branchId);
  }

  @Put('add')
  async addCorridor(@Query() query: AddCorridorDto) {
    const { branchId, corridorId } = query;
    return this.corridorService.addCorridorToBranch(corridorId, branchId);
  }

  @Put(':corridorId/clear-corridor')
  async clearCorridor(@Param('corridorId') corridorId: string) {
    return this.productService.clearCorridor(+corridorId);
  }
}
