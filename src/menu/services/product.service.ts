import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/BaseRepository';
import { Product } from 'src/database/Entity/Product';
import { ToppingsCategory } from 'src/database/Entity/ToppingCategories';
import { ToppingsCategoryService } from 'src/menu/services/toppings-category.service';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { BranchesService } from 'src/stores/services/branches.service';
import { CannotAttachTreeChildrenEntityError, Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { MoveProductCardDto } from '../dto/move-product-card.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { CorridorsService } from './corridors.service';

@Injectable()
export class ProductService {
  repo: BaseRepository<Product>;
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private toppingCategoryService: ToppingsCategoryService,
    private s3Client: S3ClientService,
    private branchService: BranchesService,
    private corridorService: CorridorsService,
  ) {
    this.repo = new BaseRepository(productRepo);
  }
  async updateProduct(productId: number, body: UpdateProductDto) {
    const { toppingCategories, ...rest } = body;
    const found = await this.repo.findOneById(+productId);
    const updated = await this.repo.update(+productId, {
      ...rest,
      image: body?.image ? body?.image : found.image,
    } as Product);
    if (toppingCategories)
      updated.toppingCategories = await this.toppingCategoryService.upsert(
        toppingCategories,
        updated,
      );

    return updated;
  }
  async createProduct(body: CreateProductDto) {
    try {
      const { corridorId, ...rest } = body;
      const currCorridor =
        await this.corridorService.getCorridorById(corridorId);
      const index = currCorridor.products.length;
      const saved = await this.repo.create({
        ...rest,
        corridorId,
        index: rest?.index || index,
        toppingCategories: [] as ToppingsCategory[],
        id: null,
        corridor: currCorridor,
      } as Product);
      if (rest.toppingCategories)
        saved.toppingCategories = await this.toppingCategoryService.upsert(
          rest.toppingCategories,
          saved,
        );
      return saved;
    } catch (error) {
      throw error;
    }
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
    await this.repo.delete(productId);
    await this.s3Client.deleteObject(found.image);
    return found;
  }

  async getProductsByCorridorId(corridorId: number) {
    const result = await this.repo
      .createQueryBuilder('products')
      .innerJoin('products.corridor', 'corridor')
      .leftJoinAndSelect('products.toppingCategories', 'categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('corridor.corridorId=:corridorId', { corridorId })
      .getMany();
    return result;
  }
  async getProductsByStore(storeId: number) {
    const result = await this.repo
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.toppingCategories', 'categories')
      .innerJoin('products.corridor', 'corridor')
      .innerJoin('corridor.branches', 'branches')
      .innerJoin('branches.store', 'store')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('store.id=:storeId', { storeId })
      .getMany();
    return result;
  }
  async getProductById(productId: number) {
    const result = await this.repo
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.toppingCategories', 'categories')
      .leftJoinAndSelect('categories.toppings', 'toppings')
      .where('products.productId=:productId', { productId })
      .getOne();
    return result;
  }

  async moveCard(body: MoveProductCardDto) {
    const { branchId, corridorId, id: productId, index } = body;
    const branchFound = await this.branchService.getMenuBoard(branchId);
    const productFound = await this.getProductById(productId);

    if (!branchFound)
      throw new NotFoundException(`Branch id notFound, id: ${branchId}`);

    const prevCorridor = branchFound.corridors.find(
      (el) => el.id == productFound.corridorId,
    );
    // const prevIndexProduct = branchFound.corridors[
    //   prevCorridor.index
    // ].products.find((el) => el.id == productFound.id)?.index;

    const newCorridor = branchFound.corridors.find((el) => el.id == corridorId);

    if (!newCorridor || prevCorridor.id == newCorridor.id) {
      // remove product inside an array
      prevCorridor.products.splice(productFound.index, 1);
      // put in the new order
      prevCorridor.products.splice(index, 0, productFound);

      const prevPromises = prevCorridor.products
        // Reasign indexes
        .map((product, index) => {
          return {
            ...product,
            index,
          };
        })
        // Bulk update
        .map((item) => this.updateProduct(item.id, item));
      const prevUpdatedProducts = await Promise.all(prevPromises);

      branchFound.corridors[prevCorridor.index].products = prevUpdatedProducts;
    } else {
      // remove product inside an array
      prevCorridor.products.splice(productFound.index, 1);

      const prevCorridorPromises = prevCorridor.products
        // Reasign order
        .map((product, index) => {
          return {
            ...product,
            index,
          };
        }) // Bulk update
        .map((item) => this.updateProduct(item.id, item));

      const prevCorridorProds = await Promise.all(prevCorridorPromises);
      // put the product in the new corridor
      newCorridor.products.splice(index, 0, { ...productFound, corridorId });
      const currCorridorPromises = newCorridor.products
        // reasign order
        .map((product, index) => {
          return {
            ...product,
            index,
          };
        }) // Bulk updated
        .map((item) => this.updateProduct(item.id, item));

      const currentCorriodrProds = await Promise.all(currCorridorPromises);

      branchFound.corridors[prevCorridor.index].products = prevCorridorProds;
      branchFound.corridors[newCorridor.index].products = currentCorriodrProds;
    }

    return branchFound;
  }
}
