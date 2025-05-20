import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";

@Injectable()
export class ValidateOfferMiddleware implements NestMiddleware {
  constructor(private readonly offer: GeneralOfferService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.offer_id) {
      const offer = await this.offer.findOne(body.offer_id);
      if (!offer) {
        throw new BadRequestException("Invalid offer");
      }
      req["offer"] = offer;
    }
    next();
  }
}
