import { Category } from "src/categories/category.entity";
import { Purchases } from "src/purchases/purchases.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column("decimal", { precision: 10, scale: 2 })
  selling_price: number;

  @Column()
  store: number;

  @Column({ nullable: true })
  featured_image: string; // Add featured_image column

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Category, category => category.products, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Purchases, purchase => purchase.product, {
    cascade: true,
  })
  purchases: Purchases[];
}
