import { forwardRef, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "src/categories/category.module";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { ProductMiddleware } from "./middleware/product.middleware";
import { ProductController } from "./product.controller";
import { Product } from "./product.entity";
import { ProductService } from "./products.service";

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    GeneralSettingsModule,
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProductMiddleware).forRoutes("product/store", "product/update");
  }
}
