import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.task, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => User, user => user.createdTasks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column()
  name: string;

  @Column()
  note: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
