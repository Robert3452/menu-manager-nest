import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BranchesService } from '../services/branches.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { AuthGuard } from 'src/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('branches')
export class BranchesController {
  constructor(private brancheService: BranchesService) {}

  @Put(':branchId')
  async updateBranch(
    @Param('branchId') branchId: string,
    @Body() body: UpdateBranchDto,
  ) {
    const data = await this.brancheService.updateBranch(+branchId, body);
    return { data, message: 'Branch updated successfully', success: true };
  }

  @Delete(':branchId')
  async deleteBranch(@Param('branchId') branchId: string) {
    const data = await this.brancheService.deleteBranch(+branchId);
    return { data, message: 'Branch deleted successfully', success: true };
  }

  @Get(':branchId')
  async getBranchById(@Param('branchId') branchId: string) {
    const data = await this.brancheService.getBranchById(+branchId);
    return { data, message: 'Branch by id', success: true };
  }

  @Get(':branchId/menu')
  async getCorridorsByBranch(@Param('branchId') branchId: string) {
    const data = await this.brancheService.getMenuBoard(+branchId);
    return { data, message: 'Menu board', success: true };
  }

  @Post()
  async createBranch(@Body() body: CreateBranchDto) {
    const data = await this.brancheService.createBranch(body);
    return { data, message: 'Branch created', success: true };
  }
}
