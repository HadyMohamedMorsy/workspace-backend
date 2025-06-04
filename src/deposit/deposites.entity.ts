import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { DepositeStatus, PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deposite extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  total_price: number;

  @Column({ type: "enum", enum: DepositeStatus, default: DepositeStatus.COMPLETE })
  status: DepositeStatus;

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

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
