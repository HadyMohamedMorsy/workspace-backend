import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DepositeService } from "src/deposit/deposites.service";
import { AssignesMembershipService } from "../assignes-membership.service";

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(
    private readonly memberShip: AssignesMembershipService,
    protected readonly depositeService: DepositeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { membership_id } = req.body;

    if (membership_id) {
      const memberShip = await this.memberShip.findOne(membership_id);
      if (!memberShip) throw new NotFoundException(`membership with id ${membership_id} not found`);

      const deposite = await this.depositeService.create({
        total_price: req.body.total_price,
        status: req.body.status,
        assignMembership: memberShip,
        createdBy: req["createdBy"],
      });

      if (deposite.total_price >= memberShip.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than deal total price (${memberShip.total_price})`,
        );
      }
      req["deposite"] = deposite;
    }
    next();
  }
}
