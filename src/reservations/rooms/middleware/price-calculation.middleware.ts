import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { calculateOfferDiscount } from "src/reservations/helpers/utitlties";

@Injectable()
export class PriceCalculationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const offer = req["offer"];
      const pck = req["assignPackage"];
      const deal = req["deal"];
      const room = req["room"];

      let basePrice = 0;

      if (!pck || !deal) {
        basePrice = req.body.used ? +room.price * req.body.used : +room.price;
      }
      const discount = calculateOfferDiscount(basePrice, offer);
      const totalPrice = basePrice - discount;
      req["totalPrice"] = totalPrice;

      next();
    } catch (error) {
      next(error);
    }
  }
}
