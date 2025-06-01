import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { calculateOfferDiscount } from "src/reservations/helpers/utitlties";

@Injectable()
export class CalculateDealPriceMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { hours, price_hour } = req.body;
      const offer = req["offer"];

      // Calculate base price
      const basePrice = +hours * +price_hour;

      // Calculate discount if offer exists
      const discount = calculateOfferDiscount(+basePrice, offer);
      const totalPrice = +basePrice - +discount;
      // Attach calculated values to request
      req["total_price"] = +totalPrice;

      next();
    } catch (error) {
      next(error);
    }
  }
}
