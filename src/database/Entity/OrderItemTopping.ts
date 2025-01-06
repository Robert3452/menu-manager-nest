import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './OrderItem';
import { Topping } from './Topping';

@Entity({ name: 'order_item_toppings' })
export class OrderItemTopping {
  @PrimaryGeneratedColumn({ name: 'orderItemToppingId' })
  id: number;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.orderItemToppings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;

  @Column({ name: 'orderItemId' })
  orderItemId: number;

  @ManyToOne(() => Topping, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toppingId' })
  topping: Topping;

  @Column({ name: 'toppingId' })
  toppingId: number;

  @Column({ type: 'integer', name: 'quantity' })
  quantity: number;

  @Column({ type: 'decimal', name: 'price' })
  price: number;
}
