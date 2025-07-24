import { forwardRef, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesPackagesModule } from "src/assigness-packages-offers/assignes-packages.module";
import { CompanyModule } from "src/companies/company.module";
import { DealsModule } from "src/deals/deals.module";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { AssignesPackageMiddleware } from "src/shared/middleware/assigness/assignes-package.middleware";
import { DealsMiddleware } from "src/shared/middleware/assigness/deals.middleware";
import { ReservationRoomMiddleware } from "src/shared/middleware/co-working-space-reservations/reservation-room.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { DateFormatMiddleware } from "src/shared/middleware/date-format.middleware";
import { UpdateDealUsageMiddleware } from "src/shared/middleware/remaining/update-deal-usage.middleware";
import { UpdatePackageUsageMiddleware } from "src/shared/middleware/remaining/update-package-usage.middleware";
import { ValidateOfferRangeMiddleware } from "src/shared/middleware/validate-offer-range.middleware";
import { ValidateOfferMiddleware } from "src/shared/middleware/validate-offer.middleware";
import { ValidateRoomMiddleware } from "src/shared/middleware/validate-room.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { PriceCalculationMiddleware } from "./middleware/price-calculation.middleware";
import { ReservationRoomValidationMiddleware } from "./middleware/reservation-room-validation.middleware";
import { ReservationCalendarService } from "./reservation-calendar.service";
import { ReservationRoomQueryService } from "./reservation-room-query.service";
import { ReservationRoomController } from "./reservation-room.controller";
import { ReservationRoom } from "./reservation-room.entity";
import { ReservationRoomService } from "./reservation-room.service";

@Module({
  imports: [
    GeneralOffer,
    forwardRef(() => CompanyModule),
    forwardRef(() => IndividualModule),
    forwardRef(() => StudentActivityModule),
    RoomsModule,
    AssignGeneralOfferModule,
    GeneralOfferModule,
    UsersModule,
    forwardRef(() => AssignesPackagesModule),
    forwardRef(() => DealsModule),
    TypeOrmModule.forFeature([ReservationRoom]),
  ],
  controllers: [ReservationRoomController],
  providers: [ReservationRoomService, ReservationRoomQueryService, ReservationCalendarService],
  exports: [ReservationRoomService],
})
export class ReservationRoomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CustomerMiddleware,
        DateFormatMiddleware,
        ValidateRoomMiddleware,
        ReservationRoomValidationMiddleware,
        ValidateOfferMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        AssignesPackageMiddleware,
        UpdatePackageUsageMiddleware,
        DealsMiddleware,
        UpdateDealUsageMiddleware,
        PriceCalculationMiddleware,
      )
      .forRoutes("reservation-room/store");

    consumer
      .apply(
        DealsMiddleware,
        UpdateDealUsageMiddleware,
        AssignesPackageMiddleware,
        UpdatePackageUsageMiddleware,
      )
      .forRoutes("reservation-room/change-status");
  }
}
