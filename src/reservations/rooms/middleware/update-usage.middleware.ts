import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { Deals } from "src/deals/deals.entity";
import { DealsService } from "src/deals/deals.service";

@Injectable()
export class UpdateUsageMiddleware implements NestMiddleware {
  constructor(
    private readonly packageRooms: AssignesPackagesService,
    private readonly deal: DealsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const pkg = req["pkg"];
    const deal = req["deal"];
    const diffHours = req["diffHours"];

    if (pkg) {
      await this.updatePackageUsage(pkg, diffHours);
    }

    if (deal) {
      await this.updateDealUsage(deal, diffHours);
    }

    next();
  }

  private async updatePackageUsage(pkg: AssignesPackages, diffHours: number) {
    if (!pkg) {
      throw new BadRequestException("Invalid package");
    }

    const newUsed = pkg.used + diffHours;
    const newRemaining = pkg.total_used - newUsed;

    if (pkg.total_used < newUsed) {
      throw new BadRequestException(
        `Your package quota is exhausted. Please create a new package.`,
      );
    }

    await this.packageRooms.update({
      id: pkg.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }

  private async updateDealUsage(deal: Deals, diffHours: number) {
    if (!deal) {
      throw new BadRequestException("Invalid deal");
    }

    const newUsed = deal.used + diffHours;
    const newRemaining = deal.total_used - newUsed;

    if (deal.total_used < newUsed) {
      throw new BadRequestException(`Your deal quota is exhausted. Please create a new deal.`);
    }

    await this.deal.update({
      id: deal.id,
      used: newUsed,
      remaining: newRemaining,
    });
  }
}
