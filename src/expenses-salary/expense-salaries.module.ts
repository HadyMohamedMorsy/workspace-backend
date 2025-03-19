import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { UsersModule } from "./../users/users.module";
import { ExpensesSalariesController } from "./expense-salaries.controller";
import { ExpenseSalaries } from "./expense-salaries.entity";
import { ExpensesSalariesService } from "./expense-salaries.service";

@Module({
  imports: [UsersModule, GeneralSettingsModule, TypeOrmModule.forFeature([ExpenseSalaries])],
  controllers: [ExpensesSalariesController],
  providers: [ExpensesSalariesService],
  exports: [ExpensesSalariesService],
})
export class ExpensesSalariesModule {}
