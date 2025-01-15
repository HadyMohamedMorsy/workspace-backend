import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductsModule } from "src/products/products.module";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { OrderController } from "./order.controller";
import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";

@Module({
  imports: [ProductsModule, FilterDateModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
