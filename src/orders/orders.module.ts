import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { ProductsModule } from "src/products/products.module";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { OrderMiddleware } from "./middleware/order.middleware";
import { OrderController } from "./order.controller";
import { Order } from "./order.entity";
import { OrdersService } from "./orders.service";

@Module({
  imports: [
    CompanyModule,
    IndividualModule,
    StudentActivityModule,
    UsersModule,
    ProductsModule,
    FilterDateModule,
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware, OrderMiddleware).forRoutes("order/store");
  }
}
