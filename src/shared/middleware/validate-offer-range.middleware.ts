import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as moment from "moment-timezone";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";

@Injectable()
export class ValidateOfferRangeMiddleware implements NestMiddleware {
  constructor(private readonly offer: GeneralOfferService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    const offer = req["offer"];
    if (offer && body.selected_day) {
      await this.validateOfferRange(offer, body.selected_day);
    }

    next();
  }

  private async validateOfferRange(offer: GeneralOffer, selectedDay: string) {
    if (!offer) {
      throw new BadRequestException("Invalid offer");
    }

    // Parse dates with timezone
    const start = moment(offer.start_date).startOf("day");
    const end = moment(offer.end_date).endOf("day");
    const selected = moment(selectedDay).startOf("day");

    if (selected.isBefore(start) || selected.isAfter(end)) {
      throw new BadRequestException("Offer not active for selected date");
    }
  }
}
