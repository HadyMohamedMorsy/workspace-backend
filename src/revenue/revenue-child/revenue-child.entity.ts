import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Revenue } from "../revenue.entity";

@Entity()
export class RevenueChild extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Revenue, revenue => revenue.revenueChild, {
    onDelete: "CASCADE",
  })
  revenue: Revenue;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
