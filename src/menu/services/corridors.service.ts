import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCorridorDto } from '../dto/create-corridor.dto';
import { UpdateCorridorDto } from '../dto/update-corridor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Corridor } from 'src/database/Entity/Corridor';
import { Repository } from 'typeorm';
import { BranchesService } from 'src/stores/services/branches.service';
import { BaseRepository } from 'src/database/BaseRepository';

@Injectable()
export class CorridorsService {
  repo: BaseRepository<Corridor>;
  constructor(
    @InjectRepository(Corridor) private corridorRepo: Repository<Corridor>,
    private branchService: BranchesService,
  ) {
    this.repo = new BaseRepository(corridorRepo);
  }

  async getCorridorsByBranch(branchId: number) {
    const corridors = await this.repo
      .createQueryBuilder('corridors')
      .innerJoinAndSelect('corridors.branches', 'branches')
      .innerJoinAndSelect('branches.store', 'store')
      .leftJoinAndSelect('corridors.products', 'products')
      .where('branches.branchId=:branchId', { branchId })
      .getMany();
    return corridors;
  }

  async getCorridorById(corridorId: number) {
    const corridor = await this.repo
      .createQueryBuilder('corridors')
      .innerJoinAndSelect('corridors.branches', 'branches')
      .leftJoinAndSelect('corridors.products', 'products')
      .where('corridors.corridorId=:corridorId', { corridorId })
      .orderBy('products.index', 'ASC')
      .getOneOrFail();
    return corridor;
  }

  async updateCorridor(corridorId: number, body: UpdateCorridorDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { branchesIds, ...req } = body;
    const corridor = await this.getCorridorById(corridorId);
    if (!corridor) throw new NotFoundException('Corridor not found');
    const updated = await this.repo.update(corridorId, {
      ...corridor,
      ...req,
    });
    return updated;
  }

  async addCorridorToBranch(corridorId: number, branchId: number) {
    const corridor = await this.getCorridorById(corridorId);
    const branch = await this.branchService.getBranchById(branchId);
    corridor.branches = [...corridor.branches, branch];
    const updated = await this.repo.update(corridorId, corridor);
    return updated;
  }

  async removeCorridorToBranch(corridorId: number, branchId: number) {
    const corridor = await this.getCorridorById(corridorId);
    corridor.branches = corridor.branches.filter(
      (branch) => branch.id !== branchId,
    );
    const updated = await this.repo.update(corridorId, corridor);
    return updated;
  }

  async createCorridor(body: CreateCorridorDto) {
    const { branchesIds, ...req } = body;
    const branches = await Promise.all(
      branchesIds.map((branchId) => this.branchService.getById(branchId)),
    );
    const created = await this.repo.create({
      ...req,
      branches,
    } as Corridor);
    return created;
  }

  async deleteCorridor(corridorId: number) {
    const deleted = await this.repo.delete(corridorId);
    return deleted;
  }
}
