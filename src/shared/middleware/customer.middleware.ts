import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { UserService } from "src/users/user.service";

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly individualService: IndividualService,
    private readonly companyService: CompanyService,
    private readonly studentActivityService: StudentActivityService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { customer_id } = req.body;

    try {
      // Fetch all customer types
      const [individual, company, studentActivity, user] = await Promise.all([
        this.individualService.findOne(customer_id),
        this.companyService.findOne(customer_id),
        this.studentActivityService.findOne(customer_id),
        this.userService.findOne(customer_id),
      ]);

      // Set all customer types in request
      req["individual"] = individual;
      req["company"] = company;
      req["studentActivity"] = studentActivity;
      req["user"] = user;

      next();
    } catch (error) {
      next(error);
    }
  }
}
