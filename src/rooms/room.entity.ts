import { OfferPackages } from "src/offer-packages/offer-package.entity.ts";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  featured_image: string;

  @Column()
  capacity: number;

  @Column()
  price: number;

  @Column({ type: "text" })
  note: string;

  @OneToMany(() => OfferPackages, offerPackages => offerPackages.room)
  offers_room: OfferPackages[];

  @OneToMany(() => OfferPackages, offerPackages => offerPackages.room)
  deal_room: OfferPackages[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
