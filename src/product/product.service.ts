import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/database/Entity/Product';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ToppingsCategoryService } from 'src/toppings-category/toppings-category.service';
import { S3ClientService } from 'src/s3-client/s3-client.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private toppingCategoryService: ToppingsCategoryService,
    private s3Client: S3ClientService,
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
}
