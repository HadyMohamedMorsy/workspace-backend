import { IsEnum } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Shared {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  selected_day: string;

  @Column()
  start_hour: number;

  @Column()
  start_minute: number;

  @Column({ type: "enum", enum: TimeOfDay })
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @Column({ nullable: true })
  end_hour: number;

  @Column({ nullable: true })
  end_minute: number;

  @Column({ type: "enum", enum: ReservationStatus })
  status: ReservationStatus;

  @Column({ type: "enum", enum: TimeOfDay, nullable: true })
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @ManyToOne(() => Individual, individual => individual.shared, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.shared, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.shared, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => AssignesMembership, assignesMembership => assignesMembership.shared, {
    onDelete: "CASCADE",
  })
  assignessMemebership: AssignesMembership[];

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.shared, {
    onDelete: "CASCADE",
  })
  assignGeneralOffer: AssignGeneralOffer[];

  @Column({ nullable: true })
  total_price: number;

  @Column()
  note: string;

  @ManyToOne(() => User, user => user.createdByShared, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
