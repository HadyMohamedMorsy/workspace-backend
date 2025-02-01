import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { CoWorkingSpace } from "src/offer-co-working-space/offer-co-working-space.entity.ts";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AssignesMembership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Individual, individual => individual.assignMemeberships, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.assignMemeberships, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.assignMemeberships, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => CoWorkingSpace, coWorkingSpace => coWorkingSpace.assignessMemebership, {
    onDelete: "CASCADE",
  })
  memeberShip: CoWorkingSpace;

  @OneToMany(() => Deskarea, deskarea => deskarea.assignessMemebership, {
    onDelete: "CASCADE",
  })
  deskarea: Deskarea[];

  @OneToMany(() => Deskarea, shared => shared.assignessMemebership, {
    onDelete: "CASCADE",
  })
  shared: Shared[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
