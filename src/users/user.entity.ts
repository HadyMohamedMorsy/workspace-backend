import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Order } from "src/orders/order.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Permission, Role, UserStatus } from "src/shared/enum/global-enum";
import { Task } from "src/tasks/tasks.entity";
import { Vacation } from "src/vacation/vacation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 96,
    nullable: true,
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

  @Column({ nullable: true, default: 0 })
  annual_start: number;

  @Column({ nullable: true, default: 0 })
  annual_increase: number;

  @OneToMany(() => Task, task => task.user)
  task: Task[];

  @OneToMany(() => Vacation, vacation => vacation.user)
  vacation: Vacation[];

  @OneToMany(() => Order, order => order.employed)
  orders: Order[];

  @OneToMany(() => ExpenseSalaries, salary => salary.user)
  salaries: ExpenseSalaries[];

  @Column({ type: "enum", enum: UserStatus, nullable: true, default: UserStatus.ACTIVE })
  status: UserStatus;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}

export class PermissionsUser {
  resource: string;
  actions: Permission[];
}
