import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ExpensePlaceChild } from "./expenses-place-child/expense-place-child.entity";

@Entity()
export class ExpensePlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;rooms

  @Column({ nullable: true })
  total: number;

  @OneToMany(() => ExpensePlaceChild, expense => expense.expensePlace)
  expensePlaceChild: ExpensePlaceChild[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
