import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ExpenseSalaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  cost: number;

  @ManyToOne(() => User, user => user.salaries)
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
