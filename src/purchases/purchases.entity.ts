import { Product } from "src/products/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Purchases {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "item" })
  type_store: string;

  @Column({ nullable: true })
  purshase_price: number;

  @Column({ nullable: true })
  weight_kg: number;

  @Column({ nullable: true })
  weight_g: number;

  @Column({ nullable: true })
  weight_product: number;

  @Column({ nullable: true })
  purshase_qty: number;

  @Column({ nullable: true })
  total: number;

  @ManyToOne(() => Product, product => product.purchases, {
    onDelete: "CASCADE",
  })
  product: Product;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
