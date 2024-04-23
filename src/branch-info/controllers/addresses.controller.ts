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
    const result = await this.addressService.create(body);
    return {
      success: true,
      message: 'Address created successgully',
      data: result,
    };
  }

  @Get(':addressId')
  async getAddressById(@Param('addressId') addressId: string) {
    const result = await this.addressService.getAddressByBranchId(+addressId);
    return {
      success: true,
      message: 'Addresses by branch',
      data: result,
    };
  }

  @Put(':addressId')
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() body: UpdateAddressDto,
  ) {
    const address = await this.addressService.update(+addressId, body);
    return {
      success: true,
      message: 'Address updated successfully',
      data: address,
    };
  }

  @Delete(':addressId')
  async deleteAddres(@Param('addressId') addressId: string) {
    const deleted = await this.addressService.delete(+addressId);
    return {
      success: true,
      message: 'Address deleted successfully',
      data: deleted,
    };
  }
}
