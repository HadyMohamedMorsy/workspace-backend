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
export class StudentActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ length: 256 })
  unviresty: string;

  @Column({ length: 256 })
  college: string;

  @OneToMany(() => Deals, deals => deals.studentActivity)
  deals: Deals[];

  @OneToMany(() => Order, order => order.studentActivity)
  orders: Order[];

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.studentActivity)
  assign_general_offers: AssignGeneralOffer[];

  @OneToMany(() => AssignesMembership, AssignesMembership => AssignesMembership.studentActivity)
  assign_memberships: AssignesMembership[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.studentActivity)
  assignesPackages: AssignesPackages[];

  @OneToMany(() => Shared, shared => shared.studentActivity)
  shared: Shared[];

  @OneToMany(() => Deskarea, deskarea => deskarea.company)
  deskarea: Deskarea[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.studentActivity)
  reservationRooms: ReservationRoom[];

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
