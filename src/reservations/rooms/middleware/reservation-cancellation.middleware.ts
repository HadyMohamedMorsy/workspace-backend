import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { calculateHours } from "src/reservations/helpers/utitlties";
import { Repository } from "typeorm";

@Injectable()
export class ReservationCancellationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesPackages)
    private packageRepository: Repository<AssignesPackages>,
    @InjectRepository(Deals)
    private dealRepository: Repository<Deals>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Calculate hours for refund
      const diffHours = calculateHours({
        start_hour: req.body.start_hour,
        start_minute: req.body.start_minute,
        start_time: req.body.start_time,
        end_hour: req.body.end_hour,
        end_minute: req.body.end_minute,
        end_time: req.body.end_time,
      });

      if (req.body.package_id) {
        const pkg = await this.packageRepository.findOne({
          where: { id: req.body.package_id },
        });
        if (!pkg) {
          throw new BadRequestException("Package not found");
        }
        req["pkg"] = pkg;
      }

      if (req.body.deal_id) {
        const deal = await this.dealRepository.findOne({
          where: { id: req.body.deal_id },
        });
        if (!deal) {
          throw new BadRequestException("Deal not found");
        }
        req["deal"] = deal;
      }
      req["diffHours"] = diffHours;

      next();
    } catch (error) {
      next(error);
    }
  }
}
