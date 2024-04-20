import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AddressType } from 'src/database/Entity/Enum/AddressTypeEnum';
import { StreetType } from 'src/database/Entity/Enum/StreetTypeEnum';

export class CreateAddressDto {
  @IsString()
  address: string;
  @IsString()
  department: string;
  @IsString()
  province: string;
  @IsString()
  district: string;
  @IsString()
  mapLink?: string;
  @IsString()
  streetNumber: string;
  @IsEnum(StreetType)
  streetType: StreetType;
  @IsEnum(AddressType)
  addressType: AddressType;
  @IsString()
  phoneNumber: string;
  @IsString()
  references: string;
  @IsNumber()
  branchId: number;
}
