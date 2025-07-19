import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { CustomSettings } from "src/custom-settings/custom-settings.entity";
import { Deals } from "src/deals/deals.entity";
import { Lookup } from "src/lookups/lookup.entity";
import { Order } from "src/orders/order.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { type_work } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Individual extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  number: string;

  @Column({ unique: true, nullable: true })
  whatsApp: string;

  @Column({ enum: type_work, default: type_work.FREELANCER })
  individual_type: type_work;

  @Column({ nullable: true })
  employed_job: string;

  @Column({ nullable: true })
  freelancer_job: string;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  unviresty: Lookup;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  college: Lookup;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  nationality: Lookup;

  @OneToMany(() => Deals, deals => deals.individual)
  deals: Deals[];

  @OneToMany(() => Order, order => order.individual)
  orders: Order;

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.individual)
  assignGeneralOffers: AssignGeneralOffer[];

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

  @OneToMany(() => CustomSettings, customSettings => customSettings.individual)
  customSettings: CustomSettings[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
