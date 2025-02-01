import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReservationRoomController } from "./reservation-room.controller";
import { ReservationRoom } from "./reservation-room.entity";
import { ReservationRoomService } from "./reservation-room.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReservationRoom])],
  controllers: [ReservationRoomController],
  providers: [ReservationRoomService],
  exports: [ReservationRoomService],
})
export class ReservationRoomModule {}
