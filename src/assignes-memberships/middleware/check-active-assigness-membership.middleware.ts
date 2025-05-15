import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus, TypeUser } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesMembership } from "../assignes-membership.entity";

@Injectable()
export class AssignesMembershipMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesMembership)
    private readonly assignesMembershipRepository: Repository<AssignesMembership>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    const customer = req[customerType];

    const existingActiveMembership = await this.assignesMembershipRepository.findOne({
      where: {
        [customerType]: customer,
        memeberShip: { id: req.body.membership_id },
        status: ReservationStatus.ACTIVE,
      },
    });

    if (existingActiveMembership) {
      throw new ConflictException(
        "An active membership already exists for this customer and membership.",
      );
    }
    next();
  }
}
