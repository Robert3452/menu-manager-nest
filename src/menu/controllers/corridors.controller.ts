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
    const data = await this.corridorService.getCorridorById(+corridorId);
    return {
      success: true,
      message: 'Record of corridor',
      data,
    };
  }

  @Post()
  async createCorridor(@Body() body: CreateCorridorDto) {
    const data = await this.corridorService.createCorridor(body);
    return {
      success: true,
      message: 'Corridor created successfully',
      data,
    };
  }

  @Put(':corridorId')
  async updateCorridor(
    @Param('corridorId') corridorId: string,
    @Body() body: UpdateCorridorDto,
  ) {
    const data = await this.corridorService.updateCorridor(+corridorId, body);
    return {
      success: true,
      message: 'Corridor updated successfully',
      data,
    };
  }

  @Delete(':corridorId')
  async deleteCorridor(@Param('corridorId') corridorId: string) {
    const data = await this.corridorService.deleteCorridor(+corridorId);
    return {
      success: true,
      message: 'Corridor Deleted Succcessfully',
      data,
    };
  }

  @Put('remove')
  async removeCorridor(@Query() query: RemoveCorridorDto) {
    const { branchId, corridorId } = query;
    const data = await this.corridorService.removeCorridorToBranch(
      corridorId,
      branchId,
    );
    return {
      success: true,
      message: 'Corridor successfully removed from the branch ' + branchId,
      data,
    };
  }

  @Put('add')
  async addCorridor(@Query() query: AddCorridorDto) {
    const { branchId, corridorId } = query;
    const data = await this.corridorService.addCorridorToBranch(
      corridorId,
      branchId,
    );
    return {
      success: true,
      message:
        'Corridor successfully added to the branch wiith branchId ' + branchId,
      data,
    };
  }

  @Put(':corridorId/clear-corridor')
  async clearCorridor(@Param('corridorId') corridorId: string) {
    const data = await this.productService.clearCorridor(+corridorId);
    return {
      success: true,
      message: 'Corridor cleared successfully',
      data,
    };
  }
}
