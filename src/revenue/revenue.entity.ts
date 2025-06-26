import { Lookup } from "src/lookups/lookup.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RevenueChild } from "./revenue-child/revenue-child.entity";

@Entity()
@Index(["revenue"], { unique: true })
export class Revenue extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  revenue: Lookup;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => RevenueChild, revenueChild => revenueChild.revenue)
  revenueChild: RevenueChild[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
