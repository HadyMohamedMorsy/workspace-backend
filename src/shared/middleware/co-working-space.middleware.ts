import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";

@Injectable()
export class OfferCoWorkingSpaceMiddleware implements NestMiddleware {
  constructor(private readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { membership_id } = req.body;

    if (membership_id) {
      const memberShip = await this.offerCoWorkingSpaceService.findOne(membership_id);
      req["memberShip"] = memberShip;
    }

    next();
  }
}
