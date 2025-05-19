import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { diffrentHour } from "src/reservations/helpers/utitlties";
import { RoomsService } from "src/rooms/rooms.service";
import { TimeOfDay } from "src/shared/enum/global-enum";

export interface PriceCalculationInput {
  roomId: number;
  details: {
    start_hour: number;
    start_minute: number;
    start_time: TimeOfDay;
    end_hour: number;
    end_minute: number;
    end_time: TimeOfDay;
  };
  offerId?: number;
  packageId?: number;
  dealId?: number;
}

export interface PriceCalculationResult {
  totalPrice: number;
  basePrice: number;
  discount: number;
  hours: number;
}

@Injectable()
export class PriceCalculationMiddleware implements NestMiddleware {
  constructor(
    private readonly roomService: RoomsService,
    private readonly offerService: GeneralOfferService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const input: PriceCalculationInput = {
        roomId: req.body.room_id,
        details: {
          start_hour: req.body.start_hour,
          start_minute: req.body.start_minute,
          start_time: req.body.start_time,
          end_hour: req.body.end_hour,
          end_minute: req.body.end_minute,
          end_time: req.body.end_time,
        },
        offerId: req.body.offer_id,
        packageId: req.body.package_id,
        dealId: req.body.deal_id,
      };

      const room = await this.roomService.findOne(input.roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const hours = diffrentHour(input.details);
      const basePrice = hours ? +room.price * hours : +room.price;

      let discount = 0;

      if (input.offerId) {
        const offer = await this.offerService.findOne(input.offerId);
        if (offer) {
          const typeDiscount = offer.type_discount;
          const discountAmount = offer.discount;
          discount =
            typeDiscount === "amount" ? discountAmount : basePrice * (discountAmount / 100);
        }
      }

      const totalPrice = basePrice - discount;
      req["totalPrice"] = totalPrice;
      req["basePrice"] = basePrice;
      req["discount"] = discount;
      req["hours"] = hours;

      next();
    } catch (error) {
      next(error);
    }
  }
}
