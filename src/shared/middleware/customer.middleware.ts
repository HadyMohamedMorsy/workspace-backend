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
    const { customer_id, customer_type } = req.body;
    try {
      let customer = null;

      switch (customer_type) {
        case "individual":
          customer = await this.individualService.findOne(+customer_id);
          break;
        case "company":
          customer = await this.companyService.findOne(+customer_id);
          break;
        case "studentActivity":
          customer = await this.studentActivityService.findOne(+customer_id);
          break;
        case "user":
          customer = await this.userService.findOne(+customer_id);
          break;
      }
      req[customer_type] = customer;
      req["customer_type"] = customer_type;

      next();
    } catch (error) {
      next(error);
    }
  }
}
