import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from 'src/database/Entity/Branch';
import { StoresService } from './stores.service';
import { Store } from 'src/database/Entity/Store';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    private storeService: StoresService,
  ) {}
  async createBranch(body: CreateBranchDto) {
    const storeFound = await this.storeService.getStoreById(body.storeId);
    const created = await this.branchRepo.create({
      branchName: body.branchName,
      store: storeFound,
    } as Branch);
    return created;
  }

  async updateBranch(branchId: number, body: UpdateBranchDto) {
    let storeFound: Store = null;
    const newBranch = { branchName: body.branchName } as Branch;
    if (body.storeId) {
      storeFound = await this.storeService.getStoreById(body.storeId);
      newBranch.store = storeFound;
    }
    await this.branchRepo.update(branchId, newBranch);
    const result = await this.getBranchById(branchId);
    return result;
  }

  async deleteBranch(branchId: number) {
    const deleted = await this.branchRepo.delete(branchId);
    return deleted;
  }

  async getBranchById(branchId: number) {
    const branch = await this.branchRepo
      .createQueryBuilder('branches')
      .leftJoinAndSelect('branches.schedule', 'schedule')
      .leftJoinAndSelect('schedule.weekdaySchedules', 'weekdays')
      .leftJoinAndSelect('branches.address', 'address')
      .leftJoinAndSelect('branches.corridors', 'corridors')
      .where('branches.branchId=:branchId', { branchId })
      .getOne();
    return branch;
  }

  async getById(branchId: number) {
    const branch = await this.branchRepo.findOne({ where: { id: branchId } });
    return branch;
  }

  async getMenuBoard(branchId: number) {
    const menu = await this.branchRepo
      .createQueryBuilder('branches')
      .leftJoinAndSelect('branches.corridors', 'corridors')
      .leftJoinAndSelect('corridors.products', 'products')
      .where('branches.branchId=:branchId', { branchId })
      .orderBy('products.index', 'ASC')
      .getOne();
    return menu;
  }
}
