import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateCorridorDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  index: number;

  @IsArray()
  @IsNumber({}, { each: true })
  branchesIds: number[];
}
