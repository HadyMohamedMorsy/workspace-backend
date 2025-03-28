import { Category } from "src/categories/category.entity";
import { Purchases } from "src/purchases/purchases.entity";
import { Returns } from "src/returns/returns.entity";
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

  @Column({ nullable: true })
  selling_price: number;

  @Column({ nullable: true })
  purshase_price: number;

  @Column()
  store: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  featured_image: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Category, category => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Purchases, purchase => purchase.product)
  purchases: Purchases[];

  @OneToMany(() => Returns, returns => returns.product)
  returns: Purchases[];
}
