import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackages } from "src/offer-packages/offer-package.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
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
export class AssignesPackages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ReservationStatus })
  status: ReservationStatus;

  @ManyToOne(() => Individual, individual => individual.assignesPackages, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.assignesPackages, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.assignesPackages, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => OfferPackages, offerPackages => offerPackages.assignesPackages, {
    onDelete: "CASCADE",
  })
  packages: OfferPackages;

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.assignesPackages)
  reservationRooms: ReservationRoom;

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.assignesPackages, {
    onDelete: "CASCADE",
  })
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

  @OneToOne(() => Deposite, deposite => deposite.assignesPackages, { onDelete: "SET NULL" })
  @JoinColumn()
  deposites: Deposite;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @ManyToOne(() => User, user => user.createdByPackages, {
    onDelete: "CASCADE",
  })
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
