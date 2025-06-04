import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { ReturnsMiddleware } from "./middleware/returns.middleware";
import { ReturnsController } from "./returns.controller";
import { Returns } from "./returns.entity";
import { ReturnsService } from "./returns.service";

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([Returns])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ReturnsMiddleware)
      .forRoutes("returns/store", "returns/update", "returns/delete");
  }
}
