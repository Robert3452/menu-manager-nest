import { Injectable } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreHasUsers } from 'src/database/Entity/StoreHasUsers';
import { Repository } from 'typeorm';
export class CreateStoreHasUserDto {
  userId: number;
  storeId: number;
}

export class UpdateStoreHasUserDto extends PartialType(CreateStoreHasUserDto) {}

@Injectable()
export class StoreHasUsersService {
  constructor(
    @InjectRepository(StoreHasUsers)
    private readonly repo: Repository<StoreHasUsers>,
  ) {}

  async create(body: CreateStoreHasUserDto) {
    const created = this.repo.create(body);
    const saved = await this.repo.save(created);
    return saved;
  }

  async findUserById(userId: number) {
    const found = await this.repo
      .createQueryBuilder('stores')
      .where('stores.userId=:userId', { userId })
      .getOne();
    return found;
  }
  async findUsersByStoreId(storeId: number) {
    const found = await this.repo
      .createQueryBuilder('stores')
      .where('stores.storeId=:storeId', { storeId })
      .getMany();
    return found;
  }

  async delete(userId: number) {
    const found = await this.findUserById(userId);
    await this.repo.delete(found);
    return found;
  }
}
