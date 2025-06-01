import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Room } from "src/rooms/room.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OfferPackages extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  hours: number;

  @Column()
  price: number;

  @ManyToOne(() => Room, room => room.offersRoom, {
    onDelete: "CASCADE",
  })
  room: Room;

  @OneToMany(() => AssignesPackages, assignesPackages => assignesPackages.packages)
  assignesPackages: AssignesPackages;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
