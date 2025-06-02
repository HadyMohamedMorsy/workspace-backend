import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DealsService } from "src/deals/deals.service";

@Injectable()
export class DealsMiddleware implements NestMiddleware {
  constructor(private readonly dealsService: DealsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.deal_id;
    if (id) {
      const deal = await this.dealsService.findOne(id, {
        id: true,
        remaining: true,
        total_used: true,
        used: true,
      });
      req["deal"] = deal;
    }
    next();
  }
}
