import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { calculateOfferDiscount } from "src/reservations/helpers/utitlties";

@Injectable()
export class CalculatePackagesPriceMiddleware implements NestMiddleware {
  constructor(protected readonly offerPackagesService: OfferPackagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const pkg = req["package"];
    const offer = req["offer"];

    if (pkg && offer) {
      const hours = +pkg.hours;
      const price = +pkg.price * hours;
      const discount = calculateOfferDiscount(price, offer);
      req["totalPrice"] = price - discount;
    }
    next();
  }
}
