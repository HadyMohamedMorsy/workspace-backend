import { Product } from "src/products/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Returns {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "item" })
  type_store: string;

  @Column({ nullable: true })
  return_price: number;

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
  return_qty: number;

  @Column()
  total: number;

  @ManyToOne(() => Product, product => product.purchases, {
    onDelete: "CASCADE",
  })
  product: Product;

  @Column({ type: "text", nullable: true })
  note: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
