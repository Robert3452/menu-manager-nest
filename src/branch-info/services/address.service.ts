import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from 'src/database/Entity/Address';
import { AddressType } from 'src/database/Entity/Enum/AddressTypeEnum';
import { StreetType } from 'src/database/Entity/Enum/StreetTypeEnum';
import { Repository } from 'typeorm';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { CreateAddressDto } from '../dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}
  async create(body: CreateAddressDto) {
    try {
      const createdAddress = await this.addressRepository.create({
        ...body,
        streetType: StreetType[body.streetType],
        addressType: AddressType[body.addressType],
      } as Address);
      const saved = await this.addressRepository.save(createdAddress);
      return saved;
    } catch (error) {
      console.error(error);
    }
  }

  async update(addressId: number, body: UpdateAddressDto) {
    const found = await this.getById(addressId);
    if (!found) throw new BadRequestException('Dirección con ID no encontrada');
    await this.addressRepository.update(+addressId, {
      ...body,
      streetType: StreetType[body.streetType],
      addressType: AddressType[body.addressType],
    } as Address);
    return found;
  }

  async delete(addressId: number) {
    const deletedAddress = await this.addressRepository.delete(addressId);
    return deletedAddress;
  }

  async getById(addressId: number) {
    const address = await this.addressRepository
      .createQueryBuilder('addresses')
      .innerJoinAndSelect('addresses.branch', 'branch')
      .innerJoinAndSelect('branch.store', 'store')
      .where('addresses.addressId=:addressId', { addressId })
      .getOne();
    return address;
  }

  async getAddressByBranchId(branchId: number) {
    const address = await this.addressRepository
      .createQueryBuilder('addresses')
      .innerJoinAndSelect('addresses.branch', 'branch')
      .where('branch.id = :branchId', { branchId })
      .getOne();

    return address;
  }
}
