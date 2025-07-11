import { IsEnum } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { Company } from "src/companies/company.entity";
import { GeneralSettings } from "src/general-settings/general-settings.entity";
import { Individual } from "src/individual/individual.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod, ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deskarea extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  selected_day: string;

  @Column({ nullable: true, default: false })
  is_full_day: boolean;

  @Column({ nullable: true })
  start_hour: number;

  @Column({ nullable: true })
  start_minute: number;

  @Column({ type: "enum", enum: TimeOfDay, nullable: true })
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @Column({ nullable: true })
  end_hour: number;

  @Column({ nullable: true })
  end_minute: number;

  @Column({ type: "enum", enum: ReservationStatus, default: ReservationStatus.ACTIVE })
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

  @ManyToOne(() => AssignesMembership, assignesMembership => assignesMembership.deskarea, {
    onDelete: "CASCADE",
  })
  assignessMemebership: AssignesMembership;

  @ManyToOne(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.deskarea, {
    onDelete: "CASCADE",
  })
  assignGeneralOffer: AssignGeneralOffer;

  @ManyToOne(() => GeneralSettings, settings => settings.deskarea, {
    onDelete: "CASCADE",
  })
  settings: GeneralSettings;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  total_price: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  total_time: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
