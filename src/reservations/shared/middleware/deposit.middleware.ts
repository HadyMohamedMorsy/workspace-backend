import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DepositeService } from "src/deposit/deposites.service";
import { SharedService } from "../shared.service";

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(
    private readonly sharedService: SharedService,
    private readonly depositeService: DepositeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { shared_id, total_price, status } = req.body;

    if (!shared_id) {
      throw new BadRequestException("Shared ID is required");
    }

    const shared = await this.sharedService.findOne(shared_id);
    if (!shared) {
      throw new NotFoundException("Shared not found");
    }

    if (total_price > shared.total_price) {
      throw new BadRequestException("Deposit amount cannot be greater than total price");
    }

    const deposite = await this.depositeService.create({
      total_price,
      status,
      shared,
      createdBy: req["createdBy"],
    });

    req["deposite"] = deposite;
    next();
  }
}
