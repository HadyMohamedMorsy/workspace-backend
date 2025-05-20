import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RoomsService } from "src/rooms/rooms.service";

@Injectable()
export class ValidateRoomMiddleware implements NestMiddleware {
  constructor(private readonly room: RoomsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.room_id) {
      const room = await this.validateRoom(body.room_id);
      req["room"] = room;
    }

    next();
  }

  private async validateRoom(id: number) {
    const room = await this.room.findOne(id);
    if (!room) {
      throw new BadRequestException("Invalid room");
    }
    return room;
  }
}
