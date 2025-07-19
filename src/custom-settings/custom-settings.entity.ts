import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CustomSettings extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2, default: 0 })
  price_shared: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2, default: 0 })
  price_deskarea: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2, default: 0 })
  full_day_price_deskarea: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2, default: 0 })
  full_day_price_shared: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2, default: 0 })
  full_day_hours: number;

  @Column({ nullable: true, default: false })
  is_active: boolean;

  // Relations to Individual, Company, and StudentActivity
  @ManyToOne(() => Individual, individual => individual.customSettings, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.customSettings, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.customSettings, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
