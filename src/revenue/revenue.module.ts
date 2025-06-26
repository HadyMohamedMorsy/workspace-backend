import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupModule } from "src/lookups/lookup.module";
import { LookupListMiddleware } from "src/shared/middleware/lookup.middleware";
import { RevenueController } from "./revenue.controller";
import { Revenue } from "./revenue.entity";
import { RevenueService } from "./revenue.service";

@Module({
  imports: [LookupModule, TypeOrmModule.forFeature([Revenue])],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService],
})
export class RevenueModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LookupListMiddleware).forRoutes("revenue/store", "revenue/update");
  }
}
