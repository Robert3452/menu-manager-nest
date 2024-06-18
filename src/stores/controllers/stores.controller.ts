import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Public } from 'src/decorators/public.decorator';
@UseGuards(AuthGuard)
@Controller('stores')
export class StoreController {
  constructor(private storeService: StoresService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createStore(
    @Body() body: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['user']['id'];
    const data = await this.storeService.createStore(body, file, userId);
    return { data, message: 'Store created successfully', success: true };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':storeId')
  async updateStore(
    @Param('storeId') storeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateStoreDto,
  ) {
    const data = await this.storeService.updateStore(+storeId, body, file);
    return { data, message: 'Store updated successfully', success: true };
  }

  @Delete(':storeId')
  async deleteStore(@Param('storeId') storeId: string) {
    const data = await this.storeService.deleteStore(+storeId);
    return { data, message: 'Store deleted successfully', success: true };
  }
  @Public()
  @Get()
  async getAllStores() {
    const data = await this.storeService.getStores();
    return { data, message: 'List of Stores ', success: true };
  }
  @Public()
  @Get(':storeId')
  async getStoreById(@Param('storeId') storeId: string) {
    const data = await this.storeService.getStoreById(+storeId);
    return { data, message: 'Store by id', success: true };
  }
  @Public()
  @Get(':storeId/branches')
  async getBranchesById(@Param('storeId') storeId: string) {
    const data = await this.storeService.getBranchesByStoreId(+storeId);
    return { data, message: 'List of branches by store id', success: true };
  }
}
