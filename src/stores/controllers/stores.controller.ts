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
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { LandingPage } from 'src/database/Entity/LandingPage';
import { Store } from 'src/database/Entity/Store';
import { Public } from 'src/decorators/public.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateStoreAndBranchDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { BranchesService } from '../services/branches.service';
import { StoresService } from '../services/stores.service';
@UseGuards(AuthGuard)
@Controller('stores')
export class StoreController {
  constructor(
    private storeService: StoresService,
    private branchService: BranchesService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createStore(
    @Body() body: CreateStoreAndBranchDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['user']['id'];
    const newstore = await this.storeService.createStore(body, file, userId);
    const newBranch = await this.branchService.createBranch({
      branchName: body.branchName,
      storeId: newstore.id,
    });
    return {
      data: { ...newstore, branches: [newBranch] } as Store,
      message: 'Store created successfully',
      success: true,
    };
  }

  @UseInterceptors(FileInterceptor('image'))
  @Put(':storeId/landing-page')
  async upsertLandingPage(
    @Param('storeId') storeId: string,
    @Body() body: Partial<LandingPage>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.storeService.upsertLandingPage(
      +storeId,
      body,
      image,
    );
    return {
      data,
      message: 'Landing page upserted successfully',
      success: true,
    };
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

  @Get('my-store')
  @UseGuards(AuthGuard)
  async getStoresByOwner(@Req() req: Request) {
    const userId = req['user']['id'];
    const data = await this.storeService.getStoreByOwner(userId);
    return { data, message: 'List of Stores ', success: true };
  }

  @Get('my-store/menu')
  @UseGuards(AuthGuard)
  async getTheMainMenu(@Req() req: Request) {
    const userId = req['user']['id'];
    const data = await this.storeService.getMenuByStore(userId);
    return { data, message: 'menu by store', success: true };
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

  @Public()
  @Get(':storeId/landing-page')
  async getLandingPageByStoreId(@Param('storeId') storeId: string) {
    const data: LandingPage =
      await this.storeService.getLandingPageByStoreId(+storeId);
    return { data, message: 'Landing page by store id', success: true };
  }
}
