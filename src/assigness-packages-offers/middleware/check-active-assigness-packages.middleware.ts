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
      const existingActivePackage = await this.assignesPackagesRepository.findOne({
        relations: ["individual", "packages"],
        where: {
          individual: { id: req["individual"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActivePackage) {
        throw new ConflictException("An active package already exists for this individual.");
      }
    }

    if (req["company"]) {
      const existingActivePackage = await this.assignesPackagesRepository.findOne({
        relations: ["company", "packages"],
        where: {
          company: { id: req["company"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActivePackage) {
        throw new ConflictException("An active package already exists for this company.");
      }
    }

    if (req["studentActivity"]) {
      const existingActivePackage = await this.assignesPackagesRepository.findOne({
        relations: ["studentActivity", "packages"],
        where: {
          studentActivity: { id: req["studentActivity"].id },
          status: ReservationStatus.ACTIVE,
        },
      });

      if (existingActivePackage) {
        throw new ConflictException("An active package already exists for this student activity.");
      }
    }

    next();
  }
}
