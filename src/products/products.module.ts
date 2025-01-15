import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "src/categories/category.module";
import { ProductController } from "./product.controller";
import { Product } from "./product.entity";
import { ProductService } from "./products.service";

@Module({
  imports: [CategoryModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
