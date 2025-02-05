import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Permission, Role } from "src/shared/enum/global-enum";
import { Task } from "src/tasks/tasks.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 96,
    nullable: false,
    name: "firstname",
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
    name: "lastname",
  })
  lastName: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
  })
  username: string;

  @Column({ type: "enum", enum: Role, default: Role.OPERATION_MANAGER })
  role: Role;

  @Column("json", { nullable: true })
  permission: PermissionsUser[] | null;

  @Column({ unique: true, length: 11 })
  phone: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
  })
  password: string;

  @OneToMany(() => Task, task => task.user)
  task: Task[];

  @OneToMany(() => Task, task => task.createdBy)
  createdTasks: Task[];

  @OneToMany(() => ExpenseSalaries, salary => salary.user)
  salaries: User[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

export class PermissionsUser {
  resource: string;
  actions: Permission[];
}
