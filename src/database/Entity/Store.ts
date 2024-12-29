import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './Branch';
import { Tag } from './Tag';
import { StoreHasUsers } from './StoreHasUsers';
import { LandingPage } from './LandingPage';

@Entity({ name: 'stores' })
export class Store {
  @PrimaryGeneratedColumn({ name: 'storeId' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'logo', type: 'varchar', length: 400 })
  logo: string;

  @OneToMany(() => Branch, (branch) => branch.store)
  branches: Branch[];

  @OneToMany(() => StoreHasUsers, (storeHasUsers) => storeHasUsers.store)
  storeHasUsers: StoreHasUsers[];

  @OneToMany(() => LandingPage, (landingPage) => landingPage.store)
  landingPages: LandingPage[];
  @ManyToMany(() => Tag, (tag) => tag.stores)
  @JoinTable({
    name: 'storesHasTags',
    joinColumn: {
      name: 'storeId',
    },
    inverseJoinColumn: {
      name: 'tagId',
    },
  })
  tags: Tag[];
}
