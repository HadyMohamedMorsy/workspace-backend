import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesPackages } from "../assignes-packages.entity";

@Injectable()
export class CheckActiveAssignessPackagesMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesPackages)
    private assignesPackagesRepository: Repository<AssignesPackages>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req["individual"]) {
      const existingActiveMembership = await this.assignesPackagesRepository.findOne({
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
      const existingActiveMembership = await this.assignesPackagesRepository.findOne({
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
      const existingActiveMembership = await this.assignesPackagesRepository.findOne({
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
