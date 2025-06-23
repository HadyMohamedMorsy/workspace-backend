import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { IndividualModule } from "src/individual/individual.module";
import { OrdersModule } from "src/orders/orders.module";
import { DeskareaModule } from "src/reservations/deskarea/deskarea.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { SharedModule } from "src/reservations/shared/shared.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";

@Module({
  imports: [
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    UsersModule,
    OrdersModule,
    SharedModule,
    DeskareaModule,
    ReservationRoomModule,
    GeneralSettingsModule,
    AssignGeneralOfferModule,
    GeneralOfferModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes("invoice/send");
  }
}
