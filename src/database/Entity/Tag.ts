import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from './Store';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tagId' })
  id: number;

  @Column({ name: 'name', length: 200, type: 'varchar' })
  tagName: string;

  @ManyToMany(() => Store, (store) => store.tags)
  stores: Store[];
}
