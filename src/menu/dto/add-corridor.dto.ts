import { IsNumber } from 'class-validator';

export class AddCorridorDto {
  @IsNumber()
  branchId: number;

  @IsNumber()
  corridorId: number;
}
