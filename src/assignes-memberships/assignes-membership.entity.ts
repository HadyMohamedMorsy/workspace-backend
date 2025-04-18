import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { CoWorkingSpace } from "src/offer-co-working-space/offer-co-working-space.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { PaymentMethod, ReservationStatus } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AssignesMembership {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ReservationStatus })
  status: ReservationStatus;

  @ManyToOne(() => Individual, individual => individual.assign_memberships, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.assign_memberships, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.assign_memberships, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => CoWorkingSpace, coWorkingSpace => coWorkingSpace.assignessMemebership, {
    onDelete: "CASCADE",
  })
  memeberShip: CoWorkingSpace;

  @OneToMany(() => Deskarea, deskarea => deskarea.assignessMemebership)
  deskarea: Deskarea[];

  @OneToMany(() => Deskarea, shared => shared.assignessMemebership)
  shared: Shared[];

  @ManyToOne(
    () => AssignGeneralOffer,
    assignGeneralOffer => assignGeneralOffer.assignessMemebership,
    {
      onDelete: "CASCADE",
    },
  )
  assignGeneralOffer: AssignGeneralOffer;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  used: number;

  @Column({ nullable: true })
  total_used: number;

  @Column({ nullable: true })
  remaining: number;

  @Column({ nullable: true })
  total_price: number;

  @OneToOne(() => Deposite, deposite => deposite.assignessMemebership, { onDelete: "SET NULL" })
  @JoinColumn()
  deposites: Deposite;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @ManyToOne(() => User, user => user.createdByMemebership, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
