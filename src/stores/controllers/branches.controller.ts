import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BranchesService } from '../services/branches.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';

@Controller('branches')
export class BranchesController {
  constructor(private brancheService: BranchesService) {}

  @Put(':branchId')
  async updateBranch(
    @Param('branchId') branchId: string,
    @Body() body: UpdateBranchDto,
  ) {
    return this.brancheService.updateBranch(+branchId, body);
  }

  @Delete(':branchId')
  async deleteBranch(@Param('branchId') branchId: string) {
    return this.brancheService.deleteBranch(+branchId);
  }

  @Get(':branchId')
  async getBranchById(@Param('branchId') branchId: string) {
    return this.brancheService.getBranchById(+branchId);
  }

  @Get(':branchId/menu')
  async getCorridorsByBranch(@Param('branchId') branchId: string) {
    return this.brancheService.getMenuBoard(+branchId);
  }

  @Post()
  async createBranch(@Body() body: CreateBranchDto) {
    return this.brancheService.createBranch(body);
  }
}
