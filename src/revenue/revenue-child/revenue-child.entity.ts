import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Revenue } from "../revenue.entity";

@Entity()
export class RevenueChild extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Revenue, revenue => revenue.revenueChild, {
    onDelete: "CASCADE",
  })
  revenue: Revenue;
}
