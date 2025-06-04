import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ReservationRoomService } from "src/reservations/rooms/reservation-room.service";

@Injectable()
export class ReservationRoomMiddleware implements NestMiddleware {
  constructor(private readonly reservationRoomService: ReservationRoomService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.reservation_room_id;
    const reservationRoom = await this.reservationRoomService.findOne(id, { id: true });
    req["reservationRoom"] = reservationRoom;
    next();
  }
}
