import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { TypeUser } from "src/shared/enum/global-enum";

@Injectable()
export class SharedMiddleware implements NestMiddleware {
  constructor(
    private readonly generalOffer: GeneralOfferService,
    private readonly assignOfferservice: AssignGeneralOfferservice,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { offer_id } = req.body;
    const [offer] = await Promise.all([offer_id ? this.generalOffer.findOne(offer_id) : null]);

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
