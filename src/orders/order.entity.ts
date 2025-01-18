import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TypeOrder, TypeUser } from "./enum/type.enum";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  order_number: string;

  @Column({
    type: "enum",
    enum: TypeOrder,
  })
  type_order: TypeOrder;

  @Column({
    type: "enum",
    enum: TypeUser,
  })
  type_user: TypeUser;

  @Column({ nullable: true })
  order_price: number;

  @Column({ nullable: true })
  total_order: number;

  @Column("json", { nullable: true })
  order_items: OrderItemDto[] | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

export class OrderItemDto {
  product: number;
  quantity: number;
}
