import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesPackages } from "../assignes-packages.entity";

@Injectable()
export class CheckActivePackagesMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesPackages)
    private readonly assignesPackagesRepositry: Repository<AssignesPackages>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { customer_id, package_id, type_user } = req.body;

    if (!["individual", "company", "studentActivity"].includes(type_user)) {
      throw new Error("Invalid customer type");
    }

    let customerCondition: any;
    switch (type_user) {
      case "individual":
        customerCondition = { individual: { id: customer_id } };
        break;
      case "company":
        customerCondition = { company: { id: customer_id } };
        break;
      case "studentActivity":
        customerCondition = { studentActivity: { id: customer_id } };
        break;
    }

    const existingOfferPackage = await this.assignesPackagesRepositry.findOne({
      where: {
        ...customerCondition,
        packages: { id: package_id },
        status: ReservationStatus.ACTIVE,
      },
    });

    if (existingOfferPackage) {
      throw new ConflictException(
        "An active offer Package already exists for this customer and offer Package.",
      );
    }

    next();
  }
}
