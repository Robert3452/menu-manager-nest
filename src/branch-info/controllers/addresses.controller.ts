import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from '../services/address.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private addressService: AddressService) {}

  @Post()
  async createAddress(@Body() body: CreateAddressDto) {
    return this.addressService.create(body);
  }

  @Get(':addressId')
  async getAddressById(@Param('addressId') addressId: string) {
    return this.addressService.getAddressByBranchId(+addressId);
  }

  @Put(':addressId')
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDto,
  ) {
    return this.addressService.update(+addressId, body);
  }

  @Delete(':addressId')
  async deleteAddres(@Param('addressId') addressId: string) {
    return this.addressService.delete(+addressId);
  }
}
