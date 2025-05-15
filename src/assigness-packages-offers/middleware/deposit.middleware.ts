import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { DepositeService } from "src/deposit/deposites.service";

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(
    private readonly packagesService: AssignesPackagesService,
    protected readonly depositeService: DepositeService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { package_id } = req.body;

    if (package_id) {
      const packageData = await this.packagesService.findOne(package_id);
      if (!packageData) throw new NotFoundException(`package with id ${package_id} not found`);

      const deposite = await this.depositeService.create({
        total_price: req.body.total_price,
        status: req.body.status,
        assignPackage: packageData,
        createdBy: req["createdBy"],
      });

      if (deposite.total_price >= packageData.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than package total price (${packageData.total_price})`,
        );
      }
      req["deposite"] = deposite;
    }
    next();
  }
}
