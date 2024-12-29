import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from './Store';

@Entity({ name: 'landing_pages' })
export class LandingPage {
  @PrimaryGeneratedColumn({ name: 'landingPageId' })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'link', type: 'varchar', length: 255 })
  link: string;
  @ManyToOne(() => Store, (store) => store.landingPages)
  @JoinColumn({ name: 'storeId' })
  store: Store;
  @Column({ default: true, type: 'boolean' })
  visible: boolean;
  @Column({ name: 'storeId', type: 'int' })
  storeId: number;
}
