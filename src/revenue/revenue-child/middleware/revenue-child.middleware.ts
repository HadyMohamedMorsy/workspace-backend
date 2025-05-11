import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RevenueService } from "src/revenue/revenue.service";

@Injectable()
export class RevenueChildMiddleware implements NestMiddleware {
  constructor(private readonly revenueService: RevenueService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const revenueChild_id = req.body.revenueChild_id;
    if (revenueChild_id) {
      const revenue = await this.revenueService.findOne(revenueChild_id);
      req["revenue"] = revenue;
    }
    next();
  }
}
