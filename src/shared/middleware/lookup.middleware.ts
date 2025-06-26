import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LookupService } from "src/lookups/lookup.service";

@Injectable()
export class LookupListMiddleware implements NestMiddleware {
  constructor(private readonly lookupService: LookupService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const {
      nationality_id,
      college_id,
      unviresty_id,
      company_id,
      city_id,
      revenue_id,
      revenue_child_id,
      expense_place_id,
      expenses_child_id,
    } = req.body;

    if (nationality_id) {
      const nationality = await this.lookupService.findOne(nationality_id, {
        id: true,
        name: true,
      });
      req["nationality"] = nationality;
    }

    if (college_id) {
      const college = await this.lookupService.findOne(college_id, {
        id: true,
        name: true,
      });
      req["college"] = college;
    }

    if (unviresty_id) {
      const unviresty = await this.lookupService.findOne(unviresty_id, {
        id: true,
        name: true,
      });
      req["unviresty"] = unviresty;
    }

    if (company_id) {
      const company = await this.lookupService.findOne(company_id, {
        id: true,
        name: true,
      });
      req["company"] = company;
    }

    if (city_id) {
      const city = await this.lookupService.findOne(city_id, {
        id: true,
        name: true,
      });
      req["city"] = city;
    }

    if (revenue_id) {
      const revenue = await this.lookupService.findOne(revenue_id, {
        id: true,
        name: true,
      });
      req["revenue"] = revenue;
    }

    if (revenue_child_id) {
      const revenueChild = await this.lookupService.findOne(revenue_child_id, {
        id: true,
        name: true,
      });
      req["revenueChild"] = revenueChild;
    }

    if (expense_place_id) {
      const expensePlace = await this.lookupService.findOne(expense_place_id, {
        id: true,
        name: true,
      });
      req["expensePlace"] = expensePlace;
    }

    if (expenses_child_id) {
      const expensePlaceChild = await this.lookupService.findOne(expenses_child_id, {
        id: true,
        name: true,
      });
      req["expensePlaceChild"] = expensePlaceChild;
    }

    next();
  }
}
