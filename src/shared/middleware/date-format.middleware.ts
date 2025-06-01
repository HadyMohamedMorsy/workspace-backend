import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { formatDate } from "src/reservations/helpers/utitlties";
@Injectable()
export class DateFormatMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.selected_day) {
      req["selected_day"] = this.formatDate(req.body.selected_day);
    }
    next();
  }

  private formatDate(date: string): string {
    return formatDate(date);
  }
}
