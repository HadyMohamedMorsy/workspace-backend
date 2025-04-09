import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Deposite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  total_price: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @OneToOne(() => ReservationRoom, reservationRoom => reservationRoom.deposites)
  reservationRooms: ReservationRoom;

  @OneToOne(() => Deals, Deals => Deals.deposites)
  deal: Deals;

  @OneToOne(() => AssignesPackages, assignesPackages => assignesPackages.deposites)
  assignesPackages: AssignesPackages;

  @OneToOne(() => AssignesMembership, assignesMembership => assignesMembership.deposites)
  assignessMemebership: AssignesMembership;

  @ManyToOne(() => User, user => user.createdByDeposite)
  createdBy: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
