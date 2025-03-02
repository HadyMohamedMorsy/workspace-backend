import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Room } from "src/rooms/room.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class OfferPackages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  hours: number;

  @Column()
  price: number;

  @ManyToOne(() => Room, room => room.offersRoom, {
    onDelete: "CASCADE",
  })
  room: Room;

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.packages)
  assignesPackages: AssignesPackages;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
