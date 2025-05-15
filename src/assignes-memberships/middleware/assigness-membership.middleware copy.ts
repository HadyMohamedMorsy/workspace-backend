import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { TypeUser } from "src/shared/enum/global-enum";

@Injectable()
export class AssignesMembershipMiddleware implements NestMiddleware {
  constructor(
    private readonly generalOffer: GeneralOfferService,
    protected readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService,
    private readonly assignOfferservice: AssignGeneralOfferservice,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];

    const [offer, memeberShip] = await Promise.all([
      req.body.offer_id ? this.generalOffer.findOne(req.body.offer_id) : null,
      req.body.membership_id
        ? this.offerCoWorkingSpaceService.findOne(req.body.membership_id)
        : null,
    ]);

    const assignOffer = offer
      ? await this.assignOfferservice.create({
          generalOffer: offer,
          createdBy: req["createdBy"],
          [customerType]: customer,
        })
      : null;

    req["assignGeneralOffer"] = assignOffer;
    req["memeberShip"] = memeberShip;
    req["totalPrice"] = this.#calcTotalPrice(memeberShip.price, offer);

    next();
  }

  #calcTotalPrice(basePrice: number, offer: GeneralOffer) {
    return !offer ? basePrice : basePrice - (basePrice * offer.discount) / 100;
  }
}
