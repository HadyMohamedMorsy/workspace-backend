import { ConflictException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { AssignesMembership } from "../assignes-membership.entity";

@Injectable()
export class CheckActiveMembershipMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AssignesMembership)
    private readonly assignesMembershipRepository: Repository<AssignesMembership>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { customer_id, membership_id, type_user } = req.body;

    // Validate type_user
    if (!["individual", "company", "studentActivity"].includes(type_user)) {
      throw new Error("Invalid customer type");
    }

    // Define customer condition based on type_user
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

    const existingActiveMembership = await this.assignesMembershipRepository.findOne({
      where: {
        ...customerCondition,
        memeberShip: { id: membership_id },
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
