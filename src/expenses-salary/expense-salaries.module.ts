import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./../users/users.module";
import { ExpensesSalariesController } from "./expense-salaries.controller";
import { ExpenseSalaries } from "./expense-salaries.entity";
import { ExpensesSalariesService } from "./expense-salaries.service";
import { ExpenseSalariesMiddleware } from "./middleware/expense-salaries.middleware";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ExpenseSalaries])],
  controllers: [ExpensesSalariesController],
  providers: [ExpensesSalariesService],
  exports: [ExpensesSalariesService],
})
export class ExpensesSalariesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExpenseSalariesMiddleware).forRoutes("salary/store", "salary/update");
  }
}
