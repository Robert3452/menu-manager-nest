import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoresService } from '../services/stores.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStoreDto } from '../dto/update-store.dto';

@Controller('stores')
export class StoreController {
  constructor(private storeService: StoresService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createStore(
    @Body() body: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.storeService.createStore(body, file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':storeId')
  async updateStore(
    @Param('storeId') storeId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateStoreDto,
  ) {
    return this.storeService.updateStore(+storeId, body, file);
  }

  @Delete(':storeId')
  async deleteStore(@Param('storeId') storeId: string) {
    return this.storeService.deleteStore(+storeId);
  }

  @Get()
  async getAllStores() {
    return this.storeService.getStores();
  }
  @Get(':storeId')
  async getStoreById(@Param('storeId') storeId: string) {
    return this.storeService.getStoreById(+storeId);
  }

  @Get(':storeId/branches')
  async getBranchesById(@Param('storeId') storeId: string) {
    return this.storeService.getBranchesByStoreId(+storeId);
  }
}
