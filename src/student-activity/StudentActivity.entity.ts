import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Lookup } from "src/lookups/lookup.entity";
import { Order } from "src/orders/order.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StudentActivity extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  unviresty: Lookup;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  college: Lookup;

  @OneToMany(() => Deals, deals => deals.studentActivity)
  deals: Deals[];

  @OneToMany(() => Order, order => order.studentActivity)
  orders: Order[];

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.studentActivity)
  assignGeneralOffers: AssignGeneralOffer[];

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

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}

export class holder {
  name: string;
  number: string;
  position: string;
  whatsApp: string;
}
