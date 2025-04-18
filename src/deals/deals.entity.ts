import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Room } from "src/rooms/room.entity";
import { PaymentMethod, ReservationStatus, TypeUser } from "src/shared/enum/global-enum";
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
export class Deals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: ReservationStatus, nullable: true })
  status: ReservationStatus;

  @Column({
    type: "enum",
    enum: TypeUser,
  })
  type_user: TypeUser;

  @Column()
  hours: number;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column()
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

  @ManyToOne(() => User, user => user.createdByDeal, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @OneToOne(() => Deposite, deposite => deposite.deal, { onDelete: "SET NULL" })
  @JoinColumn()
  deposites: Deposite;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
