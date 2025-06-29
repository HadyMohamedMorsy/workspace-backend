import { IsEnum } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { Room } from "src/rooms/room.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod, ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReservationRoom extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selected_day: string;

  @Column({ type: "enum", enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  status: ReservationStatus;

  @Column()
  start_hour: number;

  @Column()
  start_minute: number;

  @Column({ type: "enum", enum: TimeOfDay })
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @Column()
  end_hour: number;

  @Column()
  end_minute: number;

  @Column({ type: "enum", enum: TimeOfDay })
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @ManyToOne(() => Individual, individual => individual.reservationRooms, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.reservationRooms, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.reservationRooms, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => AssignesPackages, assignesPackages => assignesPackages.reservationRooms, {
    onDelete: "CASCADE",
  })
  assignesPackages: AssignesPackages;

  @ManyToOne(() => Deals, deals => deals.reservationRooms, {
    onDelete: "CASCADE",
  })
  deals: Deals;

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.reservationRooms, {
    onDelete: "CASCADE",
  })
  assignGeneralOffer: AssignGeneralOffer[];

  @ManyToOne(() => Room, room => room.reservationRoom)
  room: Room;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  total_price: number;

  @Column({ nullable: true })
  total_time: number;

  @Column({ nullable: true })
  note: string;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @OneToOne(() => Deposite, deposite => deposite.reservationRooms, { onDelete: "SET NULL" })
  @JoinColumn()
  deposites: Deposite;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
