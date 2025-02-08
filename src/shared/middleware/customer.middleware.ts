import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { TypeUser } from "../enum/global-enum";

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor(
    private readonly individualService: IndividualService,
    private readonly companyService: CompanyService,
    private readonly studentActivityService: StudentActivityService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { type_user, customer_id } = req.body; // Assuming these are in the body of the request

    let customer;

    switch (type_user) {
      case TypeUser.Individual:
        customer = await this.individualService.findOne(customer_id);
        break;
      case TypeUser.Company:
        customer = await this.companyService.findOne(customer_id);
        break;
      case TypeUser.StudentActivity:
        customer = await this.studentActivityService.findOne(customer_id);
        break;
      default:
        throw new Error("Invalid user type");
    }

    req["customer"] = customer;

    next();
  }
}
