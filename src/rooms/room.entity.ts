import { Deals } from "src/deals/deals.entity";
import { OfferPackages } from "src/offer-packages/offer-package.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Room extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  featured_image: string;

  @Column()
  capacity: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: "text", nullable: true })
  note: string;

  @OneToMany(() => OfferPackages, offerPackages => offerPackages.room)
  offersRoom: OfferPackages[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.room, {
    onDelete: "CASCADE",
  })
  reservationRoom: ReservationRoom[];

  @OneToMany(() => Deals, deals => deals.room)
  deal_room: Deals[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
