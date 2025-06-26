import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ExpensesPlaceService } from "src/expenses-place/expense-place.service";

@Injectable()
export class ExpensePlaceChildMiddleware implements NestMiddleware {
  constructor(private readonly service: ExpensesPlaceService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body, method } = req;

    if (body.expensePlace_id) {
      const place = await this.service.findOne(body.expensePlace_id);
      const operator = method === "DELETE" ? -1 : 1;

      await this.service.update({
        id: place.id,
        total: +place.total + (operator === 1 ? +parseFloat(body.cost) : -parseFloat(body.cost)),
      });

      if (method !== "DELETE") req["expensePlace"] = place;
    }

    next();
  }
}
