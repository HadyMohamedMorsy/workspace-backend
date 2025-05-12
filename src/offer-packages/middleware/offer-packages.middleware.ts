import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RoomsService } from "src/rooms/rooms.service";

@Injectable()
export class OfferPackagesMiddleware implements NestMiddleware {
  constructor(private readonly roomsService: RoomsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.room_id) {
      try {
        const room = await this.roomsService.findOne(req.body.room_id);
        req["room"] = room;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Room with ID ${req.body.room_id} not found`);
        }
        throw error;
      }
    }

    next();
  }
}
