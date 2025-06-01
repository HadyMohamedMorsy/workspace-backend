import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { TasksStatus } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.task, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column({ type: "enum", enum: TasksStatus, default: TasksStatus.ACTIVE })
  status: TasksStatus = TasksStatus.ACTIVE;

  @Column()
  name: string;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
