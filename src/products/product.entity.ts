import { Category } from "src/categories/category.entity";
import { Purchase } from "src/purchase/purchase.entity";
import { Returns } from "src/returns/returns.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @ManyToMany(() => Category, category => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Purchase, purchase => purchase.product)
  purchases: Purchase[];

  @OneToMany(() => Returns, returns => returns.product)
  returns: Purchase[];
}
