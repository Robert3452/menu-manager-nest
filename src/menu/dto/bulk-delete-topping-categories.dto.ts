import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class BulkDeleteToppingCategoriesDto {
  @IsOptional()
  @IsArray()
  @IsNumber()
  ids: number[];
}
