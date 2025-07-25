import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { TypeUser } from "../enum/global-enum";

@Injectable()
export class AssignGeneralOfferMiddleware implements NestMiddleware {
  constructor(private readonly assignOfferservice: AssignGeneralOfferservice) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const offer = req["offer"];

    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];

    const assignOffer = offer
      ? await this.assignOfferservice.create({
          generalOffer: offer,
          createdBy: req["createdBy"],
          [customerType]: customer,
        })
      : null;

    req["assignGeneralOffer"] = assignOffer;

    next();
  }
}
