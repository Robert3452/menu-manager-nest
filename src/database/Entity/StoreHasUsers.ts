import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Store } from './Store';

@Entity({ name: 'store_has_users' })
export class StoreHasUsers {
  @PrimaryColumn({ name: 'storeId' })
  userId: number;

  @Column({ type: 'int', name: 'storeId' })
  storeId: number;

  @ManyToOne(() => Store, (store) => store.storeHasUsers, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  store: Store;
}
