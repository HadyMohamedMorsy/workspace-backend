import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { assignes_packages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { Room } from "src/rooms/room.entity";
import { TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ReservationRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selected_day: string;

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

  @ManyToOne(() => assignes_packages, assignes_packages => assignes_packages.reservationRooms, {
    onDelete: "CASCADE",
  })
  assignes_packages: assignes_packages;

  @ManyToOne(() => Room, room => room.reservationRoom, {
    onDelete: "CASCADE",
  })
  room: Room;

  @Column()
  note: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
