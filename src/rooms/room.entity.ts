import { Deals } from "src/deals/deals.entity";
import { OfferPackages } from "src/offer-packages/offer-package.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { User } from "src/users/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  featured_image: string;

  @Column()
  capacity: number;

  @Column()
  price: number;

  @Column({ type: "text" })
  note: string;

  @OneToMany(() => OfferPackages, offerPackages => offerPackages.room)
  offersRoom: OfferPackages[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.room)
  reservationRoom: ReservationRoom[];

  @OneToMany(() => Deals, deals => deals.room)
  deal_room: OfferPackages[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
