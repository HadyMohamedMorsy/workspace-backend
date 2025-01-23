import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TypeSallary } from "./enum/type.enum";

@Entity()
export class ExpenseSalaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  cost: number;

  @Column({ default: TypeSallary.Internal })
  type_sallary: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  destination: string;

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
