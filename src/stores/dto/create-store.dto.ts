import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;
  //   schedules?: CreateStoreDto[];
}

export class CreateStoreAndBranchDto extends CreateStoreDto {
  @IsString()
  branchName: string;
}
