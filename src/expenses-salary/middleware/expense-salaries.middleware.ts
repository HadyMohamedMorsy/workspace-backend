import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TypeSallary } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import { ExpensesSalariesService } from "../expense-salaries.service";

@Injectable()
export class ExpenseSalariesMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UserService,
    private readonly expensesSalariesService: ExpensesSalariesService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Calculate net salary
    if (req.body) {
      const netSallary = this.calculateNetSalary(req.body);
      req["net_sallary"] = +netSallary;

      // Calculate annual if internal salary
      if (req.body.type_sallary === TypeSallary.Internal && req.body.user_id) {
        const user = await this.usersService.findOne(req.body.user_id);
        if (user) {
          const annual = await this.calculateAnnual(+req.body.sallary, user);
          req["annual"] = +annual;
          req["net_sallary"] += +annual;
          req["target_user"] = user;
        }
      }
    }

    next();
  }

  private calculateNetSalary(body: any): number {
    return +body.sallary + (+body.incentives || 0) + (+body.rewards || 0) - (+body.discounts || 0);
  }

  private async calculateAnnual(salary: number, user: User): Promise<number> {
    const currentDate = new Date();
    const userRelated = await this.expensesSalariesService.findLatestByUser(user.id);

    if (currentDate.getMonth() === user.annual_start) {
      return +salary * (+user.annual_increase / 100) + (+userRelated?.annual || 0);
    }

    return +userRelated?.annual || 0;
  }
}
