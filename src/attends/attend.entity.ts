import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Attend {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attend: number;

  @Column({ type: "date", unique: true })
  date: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
