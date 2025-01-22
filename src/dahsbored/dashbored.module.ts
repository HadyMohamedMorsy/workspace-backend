import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Individual } from "src/individual/individual.entity";
import { Order } from "src/orders/order.entity";
import { Purchases } from "src/purchases/purchases.entity";
import { Returns } from "src/returns/returns.entity";
import { DahboredService } from "./dahsbored.service";
import { DashboredController } from "./dashbored.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Individual,
      ExpensePlaceChild,
      ExpenseSalaries,
      Purchases,
      Returns,
    ]),
  ],
  controllers: [DashboredController],
  providers: [DahboredService],
})
export class DashboredModule {}
