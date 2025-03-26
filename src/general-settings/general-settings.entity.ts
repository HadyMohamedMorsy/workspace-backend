import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class GeneralSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price_shared: number;

  @Column()
  price_deskarea: number;

  @Column()
  full_day_price_deskarea: number;

  @Column()
  full_day_price_shared: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Deskarea, deskarea => deskarea.settings)
  deskarea: Deskarea;

  @OneToMany(() => Shared, shared => shared.settings)
  shared: Shared;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
