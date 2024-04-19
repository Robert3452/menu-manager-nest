import { Injectable } from '@nestjs/common';
import { CreateBranchInfoDto } from './dto/create-branch-info.dto';
import { UpdateBranchInfoDto } from './dto/update-branch-info.dto';

@Injectable()
export class BranchInfoService {
  create(createBranchInfoDto: CreateBranchInfoDto) {
    return 'This action adds a new branchInfo';
  }

  findAll() {
    return `This action returns all branchInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} branchInfo`;
  }

  update(id: number, updateBranchInfoDto: UpdateBranchInfoDto) {
    return `This action updates a #${id} branchInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} branchInfo`;
  }
}
