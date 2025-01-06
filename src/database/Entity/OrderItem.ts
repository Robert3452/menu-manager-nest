import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';
import { OrderItemTopping } from './OrderItemTopping';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn({ name: 'orderItemId' })
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ name: 'orderId' })
  orderId: number;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ name: 'productId' })
  productId: number;

  @Column({ type: 'integer', name: 'quantity' })
  quantity: number;

  @Column({ type: 'decimal', name: 'price' })
  price: number;

  @OneToMany(
    () => OrderItemTopping,
    (orderItemTopping) => orderItemTopping.orderItem,
    {
      cascade: true,
    },
  )
  orderItemToppings: OrderItemTopping[];
}
