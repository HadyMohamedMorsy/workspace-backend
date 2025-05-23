import { Product } from "src/products/product.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
}
