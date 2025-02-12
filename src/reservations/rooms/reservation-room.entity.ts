import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
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
  @IsString()
  @IsNotEmpty()
  start_hour: string;

  @Column()
  start_minute: string;

  @Column({ type: "enum", enum: TimeOfDay })
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @Column()
  end_hour: string;

  @Column()
  end_minute: string;

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

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.reservationRooms, {
    onDelete: "CASCADE",
  })
  assignGeneralOffer: AssignGeneralOffer[];

  @ManyToOne(() => Room, room => room.reservationRoom, {
    onDelete: "CASCADE",
  })
  room: Room;

  @Column()
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
