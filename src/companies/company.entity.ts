import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Order } from "src/orders/order.entity";
import { CompanyType } from "src/shared/enum/global-enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  phone: string;

  @Column({ length: 256 })
  city: string;

  @Column({
    type: "enum",
    enum: CompanyType,
    default: CompanyType.GENERAL,
  })
  company_type: CompanyType;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ unique: true })
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
  assignMemeberships: AssignesMembership[];

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.studentActivity)
  assignesPackages: AssignesPackages[];

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
  whatsApp: string;
}
