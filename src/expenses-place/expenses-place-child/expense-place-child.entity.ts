import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ExpensePlace } from "../expense-place.entity";

@Entity()
export class ExpensePlaceChild {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cost: number;

  @ManyToOne(() => ExpensePlace, expense => expense.expensePlaceChild, {
    onDelete: "CASCADE",
  })
  expensePlace: ExpensePlace;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
