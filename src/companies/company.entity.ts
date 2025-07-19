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
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  phone: string;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  city: Lookup;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  company_type: Lookup;

  @Column({ type: "text", nullable: true })
  address: string;

  @ManyToOne(() => Lookup, { nullable: true, onDelete: "SET NULL" })
  nationality: Lookup;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  featured_image: string;

  @Column({ unique: true, name: "whatsapp" })
  whatsApp: string;

  @Column({ unique: true, nullable: true })
  facebook: string;

  @Column({ unique: true, nullable: true })
  website: string;

  @Column({ unique: true, nullable: true })
  instagram: string;

  @Column({ unique: true, nullable: true })
  linkedin: string;

  @Column("json", { nullable: true })
  holders: holder[] | null;

  @OneToMany(() => Deals, deals => deals.company)
  deals: Deals[];

  @OneToMany(() => Order, order => order.company)
  orders: Order[];

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.company)
  assignGeneralOffers: AssignGeneralOffer[];

  @OneToMany(() => AssignesMembership, AssignesMembership => AssignesMembership.company)
  assign_memberships: AssignesMembership[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.studentActivity)
  assignesPackages: AssignesPackages[];

  @OneToMany(() => Shared, shared => shared.company)
  shared: Shared[];

  @OneToMany(() => Deskarea, deskarea => deskarea.company)
  deskarea: Deskarea[];

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.company)
  reservationRooms: ReservationRoom[];

  @OneToMany(() => CustomSettings, customSettings => customSettings.company)
  customSettings: CustomSettings[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}

export class holder {
  name: string;
  number: string;
  whatsApp: string;
}
