import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './OrderItem';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'orderId' })
  id: number;

  @Column({ type: 'varchar', length: 100, name: 'customerName' })
  customerName: string;

  @Column({ type: 'varchar', length: 100, name: 'customerEmail' })
  customerEmail: string;

  @Column({ type: 'varchar', length: 15, name: 'customerPhone' })
  customerPhone: string;

  @Column({
    type: 'timestamp',
    name: 'orderDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  orderDate: Date;

  @Column({ type: 'decimal', name: 'totalPrice' })
  totalPrice: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  orderItems: OrderItem[];
}
