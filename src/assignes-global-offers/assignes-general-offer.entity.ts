import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { TypeUser } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
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
export class AssignGeneralOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Individual, individual => individual.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.assignGeneralOffers, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @Column({
    type: "enum",
    enum: TypeUser,
  })
  type_user: TypeUser;

  @ManyToOne(() => GeneralOffer, generalOffer => generalOffer.assignessOffers, {
    onDelete: "CASCADE",
  })
  generalOffer: GeneralOffer;

  @ManyToOne(() => User, user => user.createdByGeneralOffer, {
    onDelete: "CASCADE",
  })
  createdBy: User;

  @OneToMany(() => Shared, shared => shared.assignGeneralOffer)
  shared: Shared;

  @OneToMany(() => Deskarea, deskarea => deskarea.assignGeneralOffer)
  deskarea: Deskarea;

  @OneToMany(() => ReservationRoom, reservationRoom => reservationRoom.assignesPackages)
  reservationRooms: ReservationRoom;

  @OneToMany(() => Deals, deal => deal.assignGeneralOffer)
  deals: Deals;

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.assignGeneralOffer)
  assignesPackages: AssignesPackages;

  @OneToMany(() => AssignesMembership, assignesMembership => assignesMembership.assignGeneralOffer)
  assignessMemebership: AssignesMembership;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
