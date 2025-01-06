import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from './Store';
interface IButton {
  id: number;
  visible: boolean | string;
  index: number;
  name: string;
  link: string;
}

@Entity({ name: 'landing_pages' })
export class LandingPage {
  @PrimaryGeneratedColumn({ name: 'landingPageId' })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true })
  buttons: IButton[];

  @Column({ name: 'image', type: 'varchar', length: 255 })
  image: string;

  @Column({ name: 'link', type: 'varchar', length: 255, nullable: true })
  link: string;

  @ManyToOne(() => Store, (store) => store.landingPages)
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ default: true, type: 'boolean' })
  visible: boolean;

  @Column({ name: 'storeId', type: 'int' })
  storeId: number;
}
