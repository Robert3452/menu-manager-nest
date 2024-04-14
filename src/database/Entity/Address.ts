import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './Branch';
import { AddressType } from './Enum/AddressTypeEnum';
import { StreetType } from './Enum/StreetTypeEnum';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn({ name: 'addressId' })
  id: number;

  @Column({ name: 'address', type: 'varchar', length: 50 })
  address: string;
  @Column({ name: 'department', type: 'varchar', length: 20 })
  department: string;
  @Column({ name: 'province', type: 'varchar', length: 20 })
  province: string;
  @Column({ name: 'district', type: 'varchar', length: 50 })
  district: string;

  @Column({ type: 'varchar', name: 'mapLink', length: 500, nullable: true })
  mapLink: string;

  @Column({ type: 'varchar', name: 'streetNumber', length: 10 })
  streetNumber: string;

  @Column({ name: 'streetType', type: 'enum', enum: StreetType })
  streetType: StreetType;

  @Column({ name: 'addressType', type: 'enum', enum: AddressType })
  addressType: AddressType;

  @Column({ name: 'phoneNumber', type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ name: 'references', type: 'varchar', length: 200 })
  references: string;

  @Column({ name: 'branchId' })
  branchId: number;

  @OneToOne(() => Branch, (branch) => branch.address, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'branchId' })
  branch: Branch;
}
