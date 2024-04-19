import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/database/Entity/Store';
import { Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    private s3Client: S3ClientService,
    @InjectRepository(Store) private storeRepo: Repository<Store>,
  ) {}

  async createStore(body: CreateStoreDto, file: Express.Multer.File) {
    try {
      const url = await this.s3Client.createObject({
        bucket: 'menu-order',
        file: file,
      });
      const created = await this.storeRepo.create({
        name: body.name,
        logo: url,
      } as Store);
      return created;
    } catch (error) {
      throw error;
    }
  }

  async getBranchesByStoreId(storeId: number) {
    const result = await this.storeRepo
      .createQueryBuilder('stores')
      .innerJoinAndSelect('stores.branches', 'branches')
      .leftJoinAndSelect('branches.address', 'address')
      .where('stores.id=:storeId', { storeId })
      .getOne();
    return result;
  }
  async getStoreById(storeId: number) {
    const result = await this.storeRepo
      .createQueryBuilder('stores')
      .leftJoinAndSelect('stores.branches', 'branches')
      .where('stores.id=:storeId', { storeId })
      .getOne();
    return result;
  }
  async getStores() {
    try {
      const result = await this.storeRepo
        .createQueryBuilder('stores')
        .leftJoinAndSelect('stores.branches', 'branches')
        .leftJoin('branches.address', 'address')
        .leftJoinAndSelect('stores.tags', 'tags')
        .addSelect('address.address')
        .getMany();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateStore(
    storeId: number,
    body: UpdateStoreDto,
    file: Express.Multer.File,
  ) {
    try {
      const store: Store = { name: body.name } as Store;
      const found = await this.storeRepo.findOne({ where: { id: storeId } });
      let url: string;
      if (file) {
        await this.s3Client.deleteObject(found.logo);
        url = await this.s3Client.createObject({ bucket: 'menu-order', file });
        store.logo = url;
      }
      const updated = await this.storeRepo.update(storeId, store);
      return updated;
    } catch (error) {
      throw error;
    }
  }
  async deleteStore(storeId: number) {
    try {
      const found = await this.storeRepo.findOne({ where: { id: storeId } });
      await this.storeRepo.delete(storeId);
      const storeDeleted = await this.s3Client.deleteObject(found.logo);
      return storeDeleted;
    } catch (error) {
      console.error(error);
    }
  }
}
