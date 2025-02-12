import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
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
import { DiscountType } from "./dto/create-general-offer.dto";
import { PRODUCT_TYPE } from "./enum/product.enum";

@Entity()
export class GeneralOffer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => AssignGeneralOffer, assignGeneralOffer => assignGeneralOffer.generalOffer)
  assignessOffers: AssignGeneralOffer;

  @Column({ type: "timestamp", nullable: true })
  start_date: Date;

  @Column({ type: "timestamp", nullable: true })
  end_date: Date;

  @Column({
    type: "enum",
    enum: DiscountType,
    default: DiscountType.AMOUNT,
  })
  type_discount: DiscountType;

  @Column()
  discount: number;

  @Column({ type: "enum", enum: PRODUCT_TYPE, default: PRODUCT_TYPE.Room })
  product: PRODUCT_TYPE;

  @ManyToOne(() => User, user => user.globalOffer, {
    onDelete: "CASCADE",
  })
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
