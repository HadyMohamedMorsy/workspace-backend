import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { calculateHours } from "src/reservations/helpers/utitlties";

@Injectable()
export class CalculateHoursMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && this.hasTimeFields(req.body)) {
      req["diffHours"] = calculateHours({
        start_hour: req.body.start_hour,
        start_minute: req.body.start_minute,
        start_time: req.body.start_time,
        end_hour: req.body.end_hour,
        end_minute: req.body.end_minute,
        end_time: req.body.end_time,
      });
    }
    next();
  }

  private hasTimeFields(body: any): boolean {
    return (
      body.start_hour &&
      body.start_minute &&
      body.start_time &&
      body.end_hour &&
      body.end_minute &&
      body.end_time
    );
  }
}
