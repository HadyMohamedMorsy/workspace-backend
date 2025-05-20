import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { calculateOfferDiscount } from "src/reservations/helpers/utitlties";

@Injectable()
export class CalculateMembershipPriceMiddleware implements NestMiddleware {
  constructor(protected readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const memeberShip = req["memberShip"];
    const offer = req["offer"];
    if (memeberShip && offer) {
      const price = memeberShip.price;
      const discount = calculateOfferDiscount(price, offer);
      req["totalPrice"] = price - discount;
    }
    next();
  }
}
