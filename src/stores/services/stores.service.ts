import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import { Store } from 'src/database/Entity/Store';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { Repository } from 'typeorm';
import { StoreHasUsersService } from './store-has-user.service';
import { LandingPage } from 'src/database/Entity/LandingPage';
@Injectable()
export class StoresService {
  repo: BaseRepository<Store>;
  landingRepo: BaseRepository<LandingPage>;
  constructor(
    @InjectRepository(LandingPage)
    private readonly landingPageRepo: Repository<LandingPage>,
    private s3Client: S3ClientService,
    @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
    private userService: StoreHasUsersService,
  ) {
    this.repo = new BaseRepository(storeRepo);
    this.landingRepo = new BaseRepository(landingPageRepo);
  }

  async getLandingPageByStoreId(storeId: number) {
    try {
      const landingPage = await this.landingRepo
        .createQueryBuilder('landingPage')
        .where('landingPage.storeId = :storeId', { storeId })
        .getOne();
      return landingPage;
    } catch (error) {
      throw error;
    }
  }

  async upsertLandingPage(
    storeId: number,
    landingPageData: Partial<LandingPage>,
  ): Promise<LandingPage> {
    try {
      const landingPage = await this.landingRepo
        .createQueryBuilder('landingPage')
        .where('landingPage.storeId = :storeId', { storeId })
        .getOne();

      if (landingPage)
        return await this.landingRepo.update(
          landingPage.id,
          landingPageData as LandingPage,
        );
      return await this.landingRepo.create(landingPageData as LandingPage);
    } catch (error) {
      throw error;
    }
  }

  async createStore(
    body: CreateStoreDto,
    file: Express.Multer.File,
    userId: number,
  ) {
    try {
      const url = await this.s3Client.createObject({
        bucket: 'menu-order',
        file: file,
      });
      const store = await this.repo.create({
        name: body.name,
        logo: url,
      } as Store);
      await this.userService.create({
        storeId: store.id,
        userId,
      });
      return store;
    } catch (error) {
      throw error;
    }
  }

  async getBranchesByStoreId(storeId: number) {
    const result = await this.repo
      .createQueryBuilder('stores')
      .innerJoinAndSelect('stores.branches', 'branches')
      .leftJoinAndSelect('branches.address', 'address')
      .where('stores.id=:storeId', { storeId })
      .getOne();
    return result;
  }
  async getStoreById(storeId: number) {
    const result = await this.repo
      .createQueryBuilder('stores')
      .leftJoinAndSelect('stores.branches', 'branches')
      .where('stores.id=:storeId', { storeId })
      .getOne();
    return result;
  }
  async getStores() {
    try {
      const result = await this.repo
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

  async getStoreByOwner(userId: number) {
    try {
      const result = await this.repo
        .createQueryBuilder('stores')
        .leftJoinAndSelect('stores.branches', 'branches')
        .innerJoinAndSelect('stores.storeHasUsers', 'users')
        .leftJoinAndSelect('branches.address', 'address')
        .leftJoinAndSelect('stores.tags', 'tags')
        .where('users.userId=:userId', { userId })
        .getOne();
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getMenuByStore(userId: number) {
    try {
      const menu = await this.repo
        .createQueryBuilder('stores')
        .leftJoinAndSelect('stores.branches', 'branches')
        .innerJoinAndSelect('stores.storeHasUsers', 'users')
        .innerJoinAndSelect('branches.corridors', 'corridors')
        .leftJoinAndSelect('branches.address', 'address')
        .leftJoinAndSelect('branches.schedule', 'schedule')
        .leftJoinAndSelect('schedule.weekdaySchedules', 'weekdays')
        .leftJoinAndSelect('corridors.products', 'products')
        .leftJoinAndSelect('products.toppingCategories', 'categories')
        .leftJoinAndSelect('categories.toppings', 'toppings')
        .where('users.userId=:userId', { userId })
        .orderBy('products.index', 'ASC')
        .addOrderBy('categories.index', 'ASC')
        .addOrderBy('toppings.index', 'ASC')
        .getOne();
      return menu;
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
      const found = await this.repo.findOneById(storeId);
      let url: string;
      if (file) {
        await this.s3Client.deleteObject(found.logo);
        url = await this.s3Client.createObject({ bucket: 'menu-order', file });
        store.logo = url;
      }
      const updated = await this.repo.update(storeId, store);
      return updated;
    } catch (error) {
      throw error;
    }
  }
  async deleteStore(storeId: number) {
    try {
      const found = await this.repo.findOneById(storeId);
      await this.repo.delete(storeId);
      await this.s3Client.deleteObject(found.logo);
      return found;
    } catch (error) {
      console.error(error);
    }
  }
}
