import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesMembershipService } from "src/assignes-memberships/assignes-membership.service";
import { ReservationStatus } from "../../enum/global-enum";

@Injectable()
export class UpdateMembershipUsageMiddleware implements NestMiddleware {
  constructor(private readonly assignesMembershipService: AssignesMembershipService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req["assignMembership"] && req.body.used) {
        const membership = req["assignMembership"];
        const used = +req.body.used;
        const operator = req.body.operator;

        const payload: any = {
          id: membership.id,
        };

        if (operator === "add-used") {
          payload.remaining = +membership.remaining - +used;
          payload.used = +membership.used + +used;
        }

        if (operator === "min-used") {
          payload.remaining = +membership.remaining + +used;
          payload.used = +membership.used - +used;
          payload.status =
            payload.used < membership.total_used
              ? ReservationStatus.ACTIVE
              : ReservationStatus.COMPLETE;
        }
        // Update the remaining usage
        await this.assignesMembershipService.update(payload);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
