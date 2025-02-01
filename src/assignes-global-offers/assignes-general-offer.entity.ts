import { Company } from "src/companies/company.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { TypeUser } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AssignGeneralOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Individual, individual => individual.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @Column({
    type: "enum",
    enum: TypeUser,
  })
  type_user: TypeUser;

  @ManyToOne(() => GeneralOffer, generalOffer => generalOffer.assignessOffers, {
    onDelete: "CASCADE",
  })
  generalOffer: GeneralOffer;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
