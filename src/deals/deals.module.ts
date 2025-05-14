import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { DealsController } from "./deals.controller";
import { Deals } from "./deals.entity";
import { DealsService } from "./deals.service";
import { DealsMiddleware } from "./middleware/deals.middleware";
import { DepositMiddleware } from "./middleware/deposit.middleware";

@Module({
  imports: [
    RoomsModule,
    forwardRef(() => ReservationRoomModule),
    IndividualModule,
    CompanyModule,
    AssignGeneralOfferModule,
    DepositesModule,
    GeneralOfferModule,
    StudentActivityModule,
    UsersModule,
    TypeOrmModule.forFeature([Deals]),
  ],
  controllers: [DealsController],
  providers: [DealsService, DealsMiddleware, DepositMiddleware],
  exports: [DealsService],
})
export class DealsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerMiddleware)
      .forRoutes("deals/store")
      .apply(DealsMiddleware)
      .forRoutes("deals/store", "deals/update")
      .apply(DepositMiddleware)
      .forRoutes("deals/store-deposite");
  }
}
