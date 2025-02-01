import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Order } from "src/orders/order.entity";
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
  assignGeneralOffers: AssignGeneralOffer[];

  @OneToMany(() => AssignesMembership, AssignesMembership => AssignesMembership.studentActivity)
  assignMemeberships: AssignesMembership[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.studentActivity)
  assignesPackages: AssignesPackages[];

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
