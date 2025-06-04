import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
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
      });
      req["assignMembership"] = assignesMembership;
    }
    next();
  }
}
