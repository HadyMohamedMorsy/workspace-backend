import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "item" })
  type_store: string;

  @Column({ nullable: true })
  purchase_price: number;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    nullable: true,
  })
  weight_kg: number;

  @Column({ nullable: true })
  weight_g: number;

  @Column({ nullable: true })
  weight_product: number;

  @Column()
  purchase_qty: number;

  @Column()
  total: number;

  @ManyToOne(() => Product, product => product.purchases, {
    onDelete: "CASCADE",
  })
  product: Product;

  @Column({ type: "text", nullable: true })
  note: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
