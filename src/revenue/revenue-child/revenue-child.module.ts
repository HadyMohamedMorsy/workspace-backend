import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RevenueModule } from "../revenue.module";
import { RevenueChildMiddleware } from "./middleware/revenue-child.middleware";
import { RevenueChildController } from "./revenue-child.controller";
import { RevenueChild } from "./revenue-child.entity";
import { RevenueChildService } from "./revenue-child.service";

@Module({
  imports: [TypeOrmModule.forFeature([RevenueChild]), RevenueModule],
  controllers: [RevenueChildController],
  providers: [RevenueChildService],
})
export class RevenueChildModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RevenueChildMiddleware).forRoutes("revenue-child");
  }
}
