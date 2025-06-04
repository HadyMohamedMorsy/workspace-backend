import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExpensesPlaceModule } from "../expense-place.module";
import { ExpensesPlaceChildController } from "./expense-place-child.controller";
import { ExpensePlaceChild } from "./expense-place-child.entity";
import { ExpensesPlaceChildService } from "./expense-place-child.service";
import { ExpensePlaceChildMiddleware } from "./middleware/expense-place-child.middleware";

@Module({
  imports: [ExpensesPlaceModule, TypeOrmModule.forFeature([ExpensePlaceChild])],
  controllers: [ExpensesPlaceChildController],
  providers: [ExpensesPlaceChildService],
  exports: [ExpensesPlaceChildService],
})
export class ExpensesPlaceChildModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExpensePlaceChildMiddleware)
      .forRoutes(
        "expenses-child-place/store",
        "expenses-child-place/update",
        "expenses-child-place/delete",
      );
  }
}
