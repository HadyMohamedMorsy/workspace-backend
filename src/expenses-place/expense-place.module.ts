import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesPlaceController } from "./expense-place.controller";
import { ExpensePlace } from "./expense-place.entity";
import { ExpensesPlaceService } from "./expense-place.service";

@Module({
  imports: [TypeOrmModule.forFeature([ExpensePlace])],
  controllers: [ExpensesPlaceController],
  providers: [ExpensesPlaceService],
  exports: [ExpensesPlaceService],
})
export class ExpensesPlaceModule {}
