import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ExpensesPlaceService } from "src/expenses-place/expense-place.service";

@Injectable()
export class ExpensePlaceChildMiddleware implements NestMiddleware {
  constructor(private readonly expensePlaceService: ExpensesPlaceService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, body } = req;

    if (method === "POST" || method === "PUT") {
      if (body.expensePlace_id) {
        const expensePlace = await this.expensePlaceService.findOne(body.expensePlace_id);
        if (!expensePlace) {
          return res.status(404).json({
            statusCode: 404,
            message: "Expense place not found",
          });
        }

        const totalExpense = (expensePlace.total || 0) + (body.cost || 0);

        await this.expensePlaceService.update({
          id: expensePlace.id,
          total: totalExpense,
        });

        req["expensePlace"] = expensePlace;
      }
    }

    next();
  }
}
