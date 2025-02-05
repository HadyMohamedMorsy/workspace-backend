import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Order } from "src/orders/order.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
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
export class Individual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  number: string;

  @Column({ unique: true, name: "whatsapp" })
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

  @OneToMany(() => Deals, deals => deals.individual)
  deals: Deals[];

  @OneToMany(() => Order, order => order.individual)
  orders: Order[];

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.individual)
  assign_general_offers: AssignGeneralOffer[];

  @OneToMany(() => AssignesMembership, AssignesMembership => AssignesMembership.individual)
  assign_memberships: AssignesMembership[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.individual)
  assignesPackages: AssignesPackages[];

  @OneToMany(() => Shared, shared => shared.individual)
  shared: Shared[];

  @OneToMany(() => Deskarea, deskarea => deskarea.individual)
  deskarea: Deskarea[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.individual)
  reservationRooms: ReservationRoom[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
