import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { CategoryController } from "./category.controller";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";

@Module({
  imports: [forwardRef(() => ProductsModule), TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
