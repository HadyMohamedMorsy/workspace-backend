import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Permission } from "./enum/permissions-enum";
import { Role } from "./enum/roles-enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
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
