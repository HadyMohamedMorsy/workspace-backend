import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { RoomsService } from "src/rooms/rooms.service";
import { TypeUser } from "src/shared/enum/global-enum";

@Injectable()
export class DealsMiddleware implements NestMiddleware {
  constructor(
    private readonly generalOffer: GeneralOfferService,
    private readonly assignOfferservice: AssignGeneralOfferservice,
    private readonly roomService: RoomsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { offer_id, room_id } = req.body;

    const [offer, room] = await Promise.all([
      offer_id ? this.generalOffer.findOne(offer_id) : null,
      room_id ? this.roomService.findOne(room_id) : null,
    ]);

    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];
    const assignGeneralOffer = await this.assignOfferservice.create({
      generalOffer: offer,
      createdBy: req["createdBy"],
      [customerType]: customer,
    });

    req["assignGeneralOffer"] = assignGeneralOffer;
    req["room"] = room;
    next();
  }
}
