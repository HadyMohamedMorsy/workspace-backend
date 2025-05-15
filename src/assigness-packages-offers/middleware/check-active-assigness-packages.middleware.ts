import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus, TypeUser } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesPackages } from "../assignes-packages.entity";

@Injectable()
export class CheckActiveAssignessPackagesMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesPackages)
    private assignesPackagesRepository: Repository<AssignesPackages>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];

    const existingActivePackage = await this.assignesPackagesRepository.findOne({
      where: {
        [customerType]: customer,
        packages: { id: req.body.package_id },
        status: ReservationStatus.ACTIVE,
      },
    });

    if (existingActivePackage) {
      throw new ConflictException(
        "An active package already exists for this customer and package.",
      );
    }
    next();
  }
}
