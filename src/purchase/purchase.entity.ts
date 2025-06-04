import { Product } from "src/products/product.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Purchase extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "item" })
  type_store: string;

  @Column({ nullable: true })
  purshase_price: number;

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

  @Column({ type: "decimal", precision: 10, scale: 2 })
  purshase_qty: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Product, product => product.purchases, {
    onDelete: "CASCADE",
  })
  product: Product;

  @Column({ type: "text", nullable: true })
  note: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
