import { Lookup } from "src/lookups/lookup.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExpensePlace } from "../expense-place.entity";

@Entity()
export class ExpensePlaceChild extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cost: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  expensePlaceChild: Lookup;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  featured_image: string;

  @ManyToOne(() => ExpensePlace, expense => expense.expensePlaceChild, {
    onDelete: "CASCADE",
  })
  expensePlace: ExpensePlace;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
