import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { ProductsModule } from "src/products/products.module";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { OrderController } from "./order.controller";
import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    ProductsModule,
    FilterDateModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
