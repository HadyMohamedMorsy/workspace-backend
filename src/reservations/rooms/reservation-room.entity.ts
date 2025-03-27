import { IsEnum } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { Individual } from "src/individual/individual.entity";
import { Room } from "src/rooms/room.entity";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ReservationRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selected_day: string;

  @Column({ type: "enum", enum: ReservationStatus })
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

  @ManyToOne(() => Room, room => room.reservationRoom, {
    onDelete: "CASCADE",
  })
  room: Room;

  @Column({ nullable: true })
  total_price: number;

  @Column({ nullable: true })
  total_time: number;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, user => user.createdByReservationRoom, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
