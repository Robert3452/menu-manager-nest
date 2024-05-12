import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from 'src/database/Entity/Branch';
import { StoresService } from './stores.service';
import { Store } from 'src/database/Entity/Store';
import { BaseRepository } from 'src/database/BaseRepository';

@Injectable()
export class BranchesService {
  repo: BaseRepository<Branch>;
  constructor(
    @InjectRepository(Branch) private branchRepo: Repository<Branch>,
    private storeService: StoresService,
  ) {
    this.repo = new BaseRepository(branchRepo);
  }
  async createBranch(body: CreateBranchDto) {
    const storeFound = await this.storeService.getStoreById(body.storeId);
    const created = await this.repo.create({
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
    await this.repo.update(branchId, newBranch);
    const result = await this.getBranchById(branchId);
    return result;
  }

  async deleteBranch(branchId: number) {
    const deleted = await this.repo.delete(branchId);
    return deleted;
  }

  async getBranchById(branchId: number) {
    const branch = await this.repo
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
    const branch = await this.repo.findOneById(branchId);
    return branch;
  }

  async getMenuBoard(branchId: number) {
    const menu = await this.repo
      .createQueryBuilder('branches')
      .leftJoinAndSelect('branches.corridors', 'corridors')
      .leftJoinAndSelect('corridors.products', 'products')
      .leftJoinAndSelect('products.toppingCategories', 'categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('branches.branchId=:branchId', { branchId })
      .orderBy('products.index', 'ASC')
      .addOrderBy('categories.index', 'ASC')
      .addOrderBy('toppings.index', 'ASC')
      .getOne();
    return menu;
  }
}
