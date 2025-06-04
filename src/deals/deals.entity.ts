import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Room } from "src/rooms/room.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod, ReservationStatus } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Deals extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  status: ReservationStatus;

  @Column()
  hours: number;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  price_hour: number;

  @Column({ nullable: true })
  total_price: number;

  @Column({ nullable: true })
  used: number;

  @Column({ nullable: true })
  total_used: number;

  @Column({ nullable: true })
  remaining: number;

  @ManyToOne(() => Room, room => room.deal_room, {
    onDelete: "CASCADE",
  })
  room: Room;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @ManyToOne(() => Individual, individual => individual.deals, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.deals, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.deals, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.deals)
  reservationRooms: ReservationRoom;

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.deals, {
    onDelete: "CASCADE",
  })
  assignGeneralOffer: AssignGeneralOffer;

  @OneToOne(() => Deposite, deposite => deposite.deal, { onDelete: "SET NULL" })
  @JoinColumn()
  deposites: Deposite;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
