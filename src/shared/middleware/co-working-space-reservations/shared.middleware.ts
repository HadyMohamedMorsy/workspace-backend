import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { SharedService } from "src/reservations/shared/shared.service";

@Injectable()
export class SharedMiddleware implements NestMiddleware {
  constructor(private readonly sharedService: SharedService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.shared_id;
    const shared = await this.sharedService.findOne(id, { id: true });
    req["shared"] = shared;
    next();
  }
}
