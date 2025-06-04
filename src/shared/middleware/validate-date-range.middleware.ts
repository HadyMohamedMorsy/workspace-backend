import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as moment from "moment-timezone";

@Injectable()
export class ValidateDateRangeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.start_date && body.end_date) {
      this.validateDateRange(body.start_date, body.end_date);
    }

    next();
  }

  private validateDateRange(startDate: string, endDate: string) {
    const start = moment(startDate, ["YYYY-MM-DD", "DD/MM/YYYY", "DD/MM"], true);
    const end = moment(endDate, ["YYYY-MM-DD", "DD/MM/YYYY", "DD/MM"], true);
    const now = moment().startOf("day");

    if (!start.isValid() || !end.isValid()) {
      throw new BadRequestException("Invalid date format");
    }

    // Compare only the dates (ignoring time)
    const startDay = start.startOf("day");
    const endDay = end.startOf("day");

    if (startDay.isBefore(now)) {
      throw new BadRequestException("Start date cannot be in the past");
    }

    if (endDay.isBefore(startDay)) {
      throw new BadRequestException("End date must be after start date");
    }
  }
}
