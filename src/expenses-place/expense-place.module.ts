import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "src/lookups/lookup.module";
import { LookupListMiddleware } from "src/shared/middleware/lookup.middleware";
import { ExpensesPlaceController } from "./expense-place.controller";
import { ExpensePlace } from "./expense-place.entity";
import { ExpensesPlaceService } from "./expense-place.service";

@Module({
  imports: [LookupModule, TypeOrmModule.forFeature([ExpensePlace])],
  controllers: [ExpensesPlaceController],
  providers: [ExpensesPlaceService],
  exports: [ExpensesPlaceService],
})
export class ExpensesPlaceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LookupListMiddleware).forRoutes("expenses-place/store", "expenses-place/update");
  }
}
