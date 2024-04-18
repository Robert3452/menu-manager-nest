import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/Entity/Product';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CreateProductDto } from '../dto/create-product.dto';
import { ToppingsCategoryService } from 'src/menu/services/toppings-category.service';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { BranchesService } from 'src/stores/services/branches.service';
import { CorridorsService } from './corridors.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private toppingCategoryService: ToppingsCategoryService,
    private s3Client: S3ClientService,
    private branchService: BranchesService,
    private corridorService: CorridorsService,
  ) {}
  async createProduct(body: CreateProductDto) {
    const { corridorId, ...rest } = body;
    // const toppingsCategories = await Promise.all(toppingCategories.map(el => toppingCategoryService.create(el)));
    const saved = await this.productRepo.create({
      ...rest,
      corridorId,
    } as Product);
    return saved;
  }
  async clearCorridor(corridorId: number) {
    const corridor = await this.corridorService.getCorridorById(corridorId);
    const ids = corridor.products.map((el) => el.id);
    const promises = ids.map((id) => this.deleteProduct(id));
    await Promise.all(promises);
    delete corridor.products;

    return corridor;
  }

  async updateImageProduct(productId: number, file: Express.Multer.File) {
    const found = await this.getProductById(productId);
    if (found.image) await this.s3Client.deleteObject(found.image);
    const url = await this.s3Client.createObject({
      bucket: 'menu-order',
      file,
    });
    found.image = url;
    const updated = await this.updateProduct(productId, found);
    return updated;
  }

  async deleteProduct(productId: number) {
    const found = await this.getProductById(productId);
    await this.productRepo.delete(productId);
    await this.s3Client.deleteObject(found.image);
    return found;
  }

  async getProductsByCorridorId(corridorId: number) {
    const result = await this.productRepo
      .createQueryBuilder('products')
      .innerJoin('products.corridor', 'corridor')
      .leftJoinAndSelect('products.toppingsCategories', 'categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('corridor.corridorId=:corridorId', { corridorId })
      .getMany();
    return result;
  }
  async getProductsByStore(storeId: number) {
    const result = await this.productRepo
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.toppingsCategories', 'categories')
      .innerJoin('products.corridor', 'corridor')
      .innerJoin('corridor.branches', 'branches')
      .innerJoin('branches.store', 'store')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('store.id=:storeId', { storeId })
      .getMany();
    return result;
  }
  async getProductById(productId: number) {
    const result = await this.productRepo
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.toppingsCategories', 'categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('products.productId=:productId', { productId })
      .getOne();
    return result;
  }
  async updateProduct(productId: number, body: UpdateProductDto) {
    const { toppingCategories, ...rest } = body;
    const found = await this.getProductById(productId);
    this.productRepo.merge(found, rest);
    const updated = await this.productRepo.save(found);
    if (body.toppingCategories)
      await this.toppingCategoryService.upsert(toppingCategories, updated);

    return updated;
  }

  async moveCard(branchId: number, body: UpdateProductDto) {
    const branchFound = await this.branchService.getMenuBoard(branchId);
    const productfound = await this.getProductById(body.id);

    // move to another corridor
    if (
      typeof body?.corridorId !== 'undefined' &&
      productfound.corridorId !== body?.corridorId
    ) {
      const oldCorridor = await this.corridorService.getCorridorById(
        productfound.corridorId,
      );
      oldCorridor.products = oldCorridor.products
        .filter((el) => el.id !== productfound.id)
        .map((el, index) => ({ ...el, index }));
      await this.corridorService.updateCorridor(oldCorridor.id, oldCorridor);
      const proms = oldCorridor.products.map((el) =>
        this.updateProduct(el.id, el),
      );
      await Promise.all(proms);
    }
    const id = body?.corridorId || productfound.corridorId;
    const newCorridor = await this.corridorService.getCorridorById(id);

    const filtered = newCorridor.products.filter(
      (el) => el.id !== productfound.id,
    );
    filtered.splice(body.index, 0, { ...productfound, corridorId: id });
    newCorridor.products = filtered.map((el, index) => ({ ...el, index }));

    // await corridorService.updateCorridor(newCorridor.id, newCorridor);
    const promises = newCorridor.products.map((el) =>
      this.updateProduct(el.id, el),
    );
    await Promise.all(promises);
    return this.branchService.getBranchById(branchFound.id);
  }
}
