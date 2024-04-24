import { IsNumber } from 'class-validator';

export class MoveProductCardDto {
  @IsNumber()
  id: number;
  @IsNumber()
  corridorId: number;
  @IsNumber()
  index: number;
  @IsNumber()
  branchId: number;
}
