import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesPlaceModule } from "../expense-place.module";
import { ExpensesPlaceChildController } from "./expense-place-child.controller";
import { ExpensePlaceChild } from "./expense-place-child.entity";
import { ExpensesPlaceChildService } from "./expense-place-child.service";

@Module({
  imports: [ExpensesPlaceModule, TypeOrmModule.forFeature([ExpensePlaceChild])],
  controllers: [ExpensesPlaceChildController],
  providers: [ExpensesPlaceChildService],
  exports: [ExpensesPlaceChildService],
})
export class ExpensesPlaceChildModule {}
