import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DepositeService } from "src/deposit/deposites.service";
import { DeskareaService } from "../deskarea.service";

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(
    private readonly deskareaService: DeskareaService,
    protected readonly depositeService: DepositeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { deskarea_id } = req.body;

    if (deskarea_id) {
      const deskarea = await this.deskareaService.findOne(deskarea_id);
      if (!deskarea) throw new NotFoundException(`Deskarea with id ${deskarea_id} not found`);

      const deposite = await this.depositeService.create({
        total_price: req.body.total_price,
        status: req.body.status,
        deskarea,
        createdBy: req["createdBy"],
      });

      if (deposite.total_price >= deskarea.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than deskarea total price (${deskarea.total_price})`,
        );
      }

      req["deposite"] = deposite;
    }

    next();
  }
}
