import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RevenueChild } from "./revenue-child/revenue-child.entity";

@Entity()
export class Revenue extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: "static" })
  type: string;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => RevenueChild, revenueChild => revenueChild.revenue)
  revenueChild: RevenueChild[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
