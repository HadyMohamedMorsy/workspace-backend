import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
}
