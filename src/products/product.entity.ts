import { Category } from "src/categories/category.entity";
import { Purchase } from "src/purchase/purchase.entity";
import { Returns } from "src/returns/returns.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Product extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  selling_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  purshase_price: number;

  @Column({ nullable: true })
  store: number;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  featured_image: string;

  @ManyToMany(() => Category, category => category.products, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Purchase, purchase => purchase.product)
  purchases: Purchase[];

  @OneToMany(() => Returns, returns => returns.product)
  returns: Purchase[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
