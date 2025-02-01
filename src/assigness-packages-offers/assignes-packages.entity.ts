import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackages } from "src/offer-packages/offer-package.entity.ts";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AssignesPackages {
  @PrimaryGeneratedColumn()
  id: number;

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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
