import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { calculateOfferDiscount } from "src/reservations/helpers/utitlties";

@Injectable()
export class PriceCalculationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = req["offer"];
      const basePrice = req["diffHours"]
        ? +req["room"].price * req["diffHours"]
        : +req["room"].price;

      const discount = calculateOfferDiscount(basePrice, offer);
      const totalPrice = basePrice - discount;

      req["totalPrice"] = totalPrice;
      req["basePrice"] = basePrice;
      req["discount"] = discount;

      next();
    } catch (error) {
      next(error);
    }
  }
}
