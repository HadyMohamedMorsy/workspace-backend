import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { TypeMember } from "src/shared/enum/global-enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CoWorkingSpace extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  days: number;

  @Column({ type: "enum", enum: TypeMember, default: TypeMember.Shared })
  type: TypeMember;

  @OneToMany(() => AssignesMembership, assignesMembership => assignesMembership.memeberShip)
  assignessMemebership: AssignesMembership[];
}
