import { Lookup } from "src/lookups/lookup.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Revenue } from "../revenue.entity";

@Entity()
export class RevenueChild extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  revenue_child: Lookup;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Revenue, revenue => revenue.revenueChild, {
    onDelete: "CASCADE",
  })
  revenue: Revenue;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
