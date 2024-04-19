import { IsNumber } from 'class-validator';

export class RemoveCorridorDto {
  @IsNumber()
  branchId: number;

  @IsNumber()
  corridorId: number;
}
