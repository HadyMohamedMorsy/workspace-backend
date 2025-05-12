import { TypeSallary } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class ExpenseSalaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sallary: number;

  @Column({ nullable: true })
  incentives: number;

  @Column({ nullable: true })
  rewards: number;

  @Column({ nullable: true })
  discounts: number;

  @Column({ nullable: true })
  annual: number;

  @Column({ nullable: true })
  net_sallary: number;

  @Column({ default: TypeSallary.Internal })
  type_sallary: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  destination: string;

  @ManyToOne(() => User, user => user.salaries, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
