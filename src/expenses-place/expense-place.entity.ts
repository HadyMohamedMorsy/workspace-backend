import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpensePlaceChild } from "./expenses-place-child/expense-place-child.entity";

@Entity()
export class ExpensePlace extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: "static" })
  type: string;

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => ExpensePlaceChild, expense => expense.expensePlace)
  expensePlaceChild: ExpensePlaceChild[];
}
