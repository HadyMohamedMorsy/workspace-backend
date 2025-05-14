import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DepositeService } from "src/deposit/deposites.service";
import { DealsService } from "../deals.service";

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(
    private readonly dealsService: DealsService,
    protected readonly depositeService: DepositeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { deal_id } = req.body;

    if (deal_id) {
      const deal = await this.dealsService.findOne(deal_id);
      if (!deal) throw new NotFoundException(`Deal with id ${deal_id} not found`);

      const deposite = await this.depositeService.create({
        total_price: req.body.total_price,
        status: req.body.status,
        deal,
        createdBy: req["createdBy"],
      });

      if (deposite.total_price >= deal.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than deal total price (${deal.total_price})`,
        );
      }

      req["deposite"] = deposite;
    }

    next();
  }
}
