import { IsNumber, IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  branchName: string;
  @IsNumber()
  storeId: number;
}
