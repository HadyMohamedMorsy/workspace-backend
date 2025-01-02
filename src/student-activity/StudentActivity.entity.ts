import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class StudentActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ length: 256 })
  unviresty: string;

  @Column({ length: 256 })
  college: string;

  @Column("simple-array", { nullable: true })
  subjects: string[] | [null];

  @Column("json", { nullable: true })
  holders: holder[] | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

export class holder {
  name: string;
  number: string;
  position: string;
  whatsApp: string;
}
