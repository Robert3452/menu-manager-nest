import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class BulkDeleteToppingsDto {
  @IsOptional()
  @IsArray()
  @IsNumber()
  ids: number[];
}
