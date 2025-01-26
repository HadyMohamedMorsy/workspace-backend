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
export class Individual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  number: string;

  @Column({ unique: true })
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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}
