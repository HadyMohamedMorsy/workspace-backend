import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { PurchaseMiddleware } from "./middleware/purchase.middleware";
import { PurchaseController } from "./purchase.controller";
import { Purchase } from "./purchase.entity";
import { PurchaseService } from "./purchase.service";

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([Purchase])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PurchaseMiddleware)
      .forRoutes("purchases/store", "purchases/update", "purchases/delete");
  }
}
