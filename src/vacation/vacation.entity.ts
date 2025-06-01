import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vacation extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.vacation, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  selected_day: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
