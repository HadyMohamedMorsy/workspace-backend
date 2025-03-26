import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { Order } from "src/orders/order.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { Permission, Role, UserStatus } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
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

  @Column({ nullable: true })
  annual_start: number;

  @Column({ nullable: true })
  annual_increase: number;

  @OneToMany(() => Task, task => task.user)
  task: Task[];

  @OneToMany(() => Task, task => task.createdBy)
  createdByTasks: Task[];

  @OneToMany(() => Order, order => order.employed)
  orders: Order[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.createdBy)
  createdByPackages: AssignesPackages[];

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.createdBy)
  createdByGeneralOffer: AssignGeneralOffer[];

  @OneToMany(() => AssignesMembership, assignesMembership => assignesMembership.createdBy)
  createdByMemebership: AssignesMembership[];

  @OneToMany(() => Deals, deals => deals.createdBy)
  createdByDeal: Deals[];

  @OneToMany(() => Order, order => order.createdBy)
  createdByOrder: Order[];

  @OneToMany(() => StudentActivity, studentActivity => studentActivity.createdBy)
  createdByStudentActivity: StudentActivity[];

  @OneToMany(() => Company, company => company.createdBy)
  createdByCompany: Company[];

  @OneToMany(() => Individual, individual => individual.createdBy)
  createdByIndividual: Individual[];

  @OneToMany(() => Shared, shared => shared.createdBy)
  createdByShared: Shared[];

  @OneToMany(() => GeneralOffer, generalOffer => generalOffer.createdBy)
  globalOffer: GeneralOffer[];

  @OneToMany(() => Deskarea, deskarea => deskarea.createdBy)
  createdByDeskArea: Deskarea[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.createdBy)
  createdByReservationRoom: ReservationRoom[];

  @OneToMany(() => ExpenseSalaries, salary => salary.user)
  salaries: User[];

  @Column({ type: "enum", enum: UserStatus, nullable: true })
  status: UserStatus;

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
