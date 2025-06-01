import { Product } from "src/products/product.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @ManyToMany(() => Product, product => product.categories, {
    onDelete: "CASCADE",
  })
  products: Product[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
