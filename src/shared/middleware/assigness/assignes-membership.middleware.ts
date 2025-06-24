import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import * as moment from "moment-timezone";
import { AssignesMembershipService } from "src/assignes-memberships/assignes-membership.service";

@Injectable()
export class AssignesMembershipMiddleware implements NestMiddleware {
  constructor(private readonly assignesMembershipService: AssignesMembershipService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.membership_id;
    if (id) {
      const assignesMembership = await this.assignesMembershipService.findOne(id, {
        id: true,
        remaining: true,
        total_used: true,
        used: true,
        start_date: true,
        end_date: true,
      });

      // Validate membership date range
      this.validateMembershipDateRange(assignesMembership);

      req["assignMembership"] = assignesMembership;
    }
    next();
  }

  private validateMembershipDateRange(membership: any): void {
    if (!membership) {
      throw new BadRequestException("Membership not found");
    }

    const today = moment().startOf("day");
    const startDate = membership.start_date ? moment(membership.start_date).startOf("day") : null;
    const endDate = membership.end_date ? moment(membership.end_date).endOf("day") : null;

    // Check if membership has date restrictions
    if (startDate && today.isBefore(startDate)) {
      throw new BadRequestException(
        "Membership is not active yet. Start date has not been reached.",
      );
    }

    if (endDate && today.isAfter(endDate)) {
      throw new BadRequestException("Membership has expired. End date has passed.");
    }
  }
}
