import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Individual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  number: string;

  @Column({ unique: true })
  whatsApp: string;

  @Column({ default: "freelancer" })
  individual_type: string;

  @Column({ nullable: true })
  employed_job: string;

  @Column({ nullable: true })
  freelancer_job: string;

  @Column({ nullable: true })
  unviresty: string;

  @Column({ nullable: true })
  college: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
