import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { ReservationStatus } from "src/shared/enum/global-enum";

@Injectable()
export class UpdatePackageUsageMiddleware implements NestMiddleware {
  constructor(private readonly assignesPackageService: AssignesPackagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req["assignPackage"] && req.body.used) {
        const package_ = req["assignPackage"];
        const used = +req.body.used;
        const operator = req.body.operator;

        const payload: any = {
          id: package_.id,
        };

        if (operator === "min-used") {
          payload.remaining = +package_.remaining + used;
          payload.used = +package_.used - +used;
          payload.status =
            payload.used === package_.total_used
              ? ReservationStatus.COMPLETE
              : ReservationStatus.ACTIVE;
        }

        if (operator === "add-used") {
          payload.remaining = +package_.remaining - used;
          payload.used = +package_.used + +used;
          payload.status =
            payload.used === package_.total_used
              ? ReservationStatus.COMPLETE
              : ReservationStatus.ACTIVE;
        }

        // Update the remaining usage
        await this.assignesPackageService.update(payload);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
