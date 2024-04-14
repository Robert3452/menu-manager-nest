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

  @ManyToMany(() => Tag, (tag) => tag.stores)
  @JoinTable({
    name: 'storesHasTags',
    joinColumn: {
      name: 'tagId',
    },
    inverseJoinColumn: {
      name: 'storeId',
    },
  })
  tags: Tag[];
}
