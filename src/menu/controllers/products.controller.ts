import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from '../dto/create-product.dto';
import { S3ClientService } from 'src/s3-client/s3-client.service';
import { UpdateProductDto } from '../dto/update-product.dto';
import { MoveProductCardDto } from '../dto/move-product-card.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private productService: ProductService,
    private s3Client: S3ClientService,
  ) {}

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const createdImage = await this.s3Client.createObject({
      file: image,
      bucket: 'menu-order',
    });
    const data = await this.productService.createProduct({
      ...body,
      image: createdImage,
    });
    return {
      success: true,
      message: 'Product created successfully',
      data,
    };
  }

  @Put('move-card')
  async moveProductCard(@Body() body: MoveProductCardDto) {
    const data = await this.productService.moveCard(body);
    return {
      data,
      success: true,
      message: 'Product moved successfully',
    };
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    const data = await this.productService.deleteProduct(+productId);
    return {
      success: true,
      message: 'Product deleted successfully',
      data,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() body: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const image = await this.s3Client.createObject({
      file,
      bucket: 'menu-order',
    });
    const data = await this.productService.updateProduct(+productId, {
      ...body,
      image,
    });
    return {
      success: true,
      message: 'Product updated successfully',
      data,
    };
  }
}
