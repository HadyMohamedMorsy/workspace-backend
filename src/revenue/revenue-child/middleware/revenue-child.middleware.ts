import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RevenueService } from "src/revenue/revenue.service";

@Injectable()
export class RevenueChildMiddleware implements NestMiddleware {
  constructor(private readonly service: RevenueService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body, method } = req;

    if (body.revenueChild_id) {
      const revenue = await this.service.findOne(body.revenueChild_id);
      const operator = method === "DELETE" ? -1 : 1;
      await this.service.update({
        id: revenue.id,
        total:
          revenue.total + (operator === 1 ? +parseFloat(body.amount) : -parseFloat(body.amount)),
      });
      if (method !== "DELETE") req["revenue"] = revenue;
    }

    next();
  }
}
