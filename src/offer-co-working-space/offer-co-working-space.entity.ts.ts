import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { TypeMember } from "src/shared/enum/global-enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class CoWorkingSpace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  price: number;

  @Column()
  days: number;

  @Column({ type: "enum", enum: TypeMember, default: TypeMember.Shared })
  type: TypeMember;

  @OneToMany(() => AssignesMembership, assignesMembership => assignesMembership.memeberShip, {
    onDelete: "CASCADE",
  })
  assignessMemebership: AssignesMembership[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
