import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attend extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attend: number;

  @Column({ type: "date", unique: true })
  date: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
