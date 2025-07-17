import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DealsService } from "src/deals/deals.service";
import { ReservationStatus } from "src/shared/enum/global-enum";

@Injectable()
export class UpdateDealUsageMiddleware implements NestMiddleware {
  constructor(private readonly dealsService: DealsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req["deal"] && req.body.used) {
        const deal = req["deal"];
        const used = +req.body.used;
        const operator = req.body.operator;
        const payload: any = {
          id: deal.id,
          used,
        };

        if (operator === "min-used") {
          payload.remaining = +deal.remaining + used;
          payload.used = +deal.used - +used;
          payload.status =
            payload.used < deal.total_used ? ReservationStatus.ACTIVE : ReservationStatus.COMPLETE;
        }

        if (operator === "add-used") {
          payload.remaining = +deal.remaining - used;
          payload.used = +deal.used + +used;
        }

        // Update the remaining usage
        await this.dealsService.update(payload);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
