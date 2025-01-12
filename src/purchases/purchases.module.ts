import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { PurchasesController } from "./purchases.controller";
import { Purchases } from "./purchases.entity";
import { PurchasesService } from "./purchases.service";

@Module({
  imports: [ProductsModule, TypeOrmModule.forFeature([Purchases])],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
