import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesMembership } from "../assignes-membership.entity";

@Injectable()
export class checkAssignMemebershipMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesMembership)
    private readonly assignesMembershipRepository: Repository<AssignesMembership>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req["individual"]) {
      const existingActiveMembership = await this.assignesMembershipRepository.findOne({
        relations: ["individual", "memeberShip"],
        where: {
          individual: { id: req["individual"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActiveMembership) {
        throw new ConflictException("An active membership already exists for this individual.");
      }
    }

    if (req["company"]) {
      const existingActiveMembership = await this.assignesMembershipRepository.findOne({
        relations: ["company", "memeberShip"],
        where: {
          company: { id: req["company"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActiveMembership) {
        throw new ConflictException("An active membership already exists for this company.");
      }
    }

    if (req["studentActivity"]) {
      const existingActiveMembership = await this.assignesMembershipRepository.findOne({
        relations: ["studentActivity", "memeberShip"],
        where: {
          studentActivity: { id: req["studentActivity"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActiveMembership) {
        throw new ConflictException(
          "An active membership already exists for this student activity.",
        );
      }
    }

    next();
  }
}
