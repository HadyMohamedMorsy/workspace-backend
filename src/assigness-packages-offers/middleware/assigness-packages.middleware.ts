import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { TypeUser } from "src/shared/enum/global-enum";

@Injectable()
export class AssignesPackagesMiddleware implements NestMiddleware {
  constructor(
    private readonly generalOffer: GeneralOfferService,
    protected readonly offerPackagesService: OfferPackagesService,
    private readonly assignOfferservice: AssignGeneralOfferservice,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];

    const [offer, packaging] = await Promise.all([
      req.body.offer_id ? this.generalOffer.findOne(req.body.offer_id) : null,
      req.body.package_id ? this.offerPackagesService.findOne(req.body.package_id) : null,
    ]);

    const assignOffer = offer
      ? await this.assignOfferservice.create({
          generalOffer: offer,
          createdBy: req["createdBy"],
          [customerType]: customer,
        })
      : null;

    req["assignGeneralOffer"] = assignOffer;
    req["package"] = packaging;
    req["totalPrice"] = this.#calcTotalPrice(packaging.price, offer, packaging.hours);
    next();
  }

  #calcTotalPrice(basePrice: number, offer: GeneralOffer, hours: number) {
    let discount = 0;
    const totalPrice = basePrice * hours;
    if (offer) {
      const typeDiscount = offer.type_discount;
      const discountAmount = offer.discount;
      discount = typeDiscount === "amount" ? discountAmount : totalPrice * (discountAmount / 100);
    }
    return totalPrice - discount;
  }
}
