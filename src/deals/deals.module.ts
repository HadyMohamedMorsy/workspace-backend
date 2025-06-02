import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { DealsMiddleware } from "src/shared/middleware/assigness/deals.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { DepositMiddleware } from "src/shared/middleware/deposit.middleware";
import { ValidateDateRangeMiddleware } from "src/shared/middleware/validate-date-range.middleware";
import { ValidateOfferRangeMiddleware } from "src/shared/middleware/validate-offer-range.middleware";
import { ValidateOfferMiddleware } from "src/shared/middleware/validate-offer.middleware";
import { ValidateRoomMiddleware } from "src/shared/middleware/validate-room.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { DealsController } from "./deals.controller";
import { Deals } from "./deals.entity";
import { DealsService } from "./deals.service";
import { CalculateDealPriceMiddleware } from "./middleware/calculate-deal-price.middleware";

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
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ValidateDateRangeMiddleware,
        CustomerMiddleware,
        ValidateRoomMiddleware,
        ValidateOfferMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        CalculateDealPriceMiddleware,
      )
      .forRoutes("deals/store", "deals/update")
      .apply(DealsMiddleware, DepositMiddleware)
      .forRoutes("deals/deposit");
  }
}
