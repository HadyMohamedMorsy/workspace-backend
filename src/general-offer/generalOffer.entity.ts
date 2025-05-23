import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PRODUCT_TYPE } from "src/shared/enum/global-enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DiscountType } from "./dto/create-general-offer.dto";

@Entity()
export class GeneralOffer extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
}
