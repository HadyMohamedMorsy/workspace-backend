import { User } from "src/users/user.entity";
import { CreateDateColumn, DeleteDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";

export abstract class BaseMemberEntity {
  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;

  @ManyToOne(() => User)
  createdBy: User;
}
