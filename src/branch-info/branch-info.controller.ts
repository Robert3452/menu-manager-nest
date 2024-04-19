import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BranchInfoService } from './branch-info.service';
import { CreateBranchInfoDto } from './dto/create-branch-info.dto';
import { UpdateBranchInfoDto } from './dto/update-branch-info.dto';

@Controller('branch-info')
export class BranchInfoController {
  constructor(private readonly branchInfoService: BranchInfoService) {}

  @Post()
  create(@Body() createBranchInfoDto: CreateBranchInfoDto) {
    return this.branchInfoService.create(createBranchInfoDto);
  }

  @Get()
  findAll() {
    return this.branchInfoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchInfoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchInfoDto: UpdateBranchInfoDto) {
    return this.branchInfoService.update(+id, updateBranchInfoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchInfoService.remove(+id);
  }
}
