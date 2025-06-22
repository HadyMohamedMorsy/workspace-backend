import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GeneralSettings extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  price_shared: number;

  @Column({ nullable: true })
  price_deskarea: number;

  @Column({ nullable: true })
  full_day_price_deskarea: number;

  @Column({ nullable: true })
  full_day_price_shared: number;

  @Column({ nullable: true, type: "decimal", precision: 10, scale: 2 })
  full_day_hours: number;

  @Column({ nullable: true })
  alert_store: number;

  @OneToMany(() => Deskarea, deskarea => deskarea.settings)
  deskarea: Deskarea;

  @OneToMany(() => Shared, shared => shared.settings)
  shared: Shared;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
