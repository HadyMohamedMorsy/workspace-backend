import { BaseMemberEntity } from "src/shared/entities/base.entity";
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
  featured_image: string;

  @ManyToOne(() => ExpensePlace, expense => expense.expensePlaceChild, {
    onDelete: "CASCADE",
  })
  expensePlace: ExpensePlace;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
