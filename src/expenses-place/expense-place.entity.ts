import { Lookup } from "src/lookups/lookup.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpensePlaceChild } from "./expenses-place-child/expense-place-child.entity";

@Entity()
@Index(["expensePlace"], { unique: true })
export class ExpensePlace extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  expensePlace: Lookup;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => ExpensePlaceChild, expense => expense.expensePlace)
  expensePlaceChild: ExpensePlaceChild[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
