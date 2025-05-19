import { forwardRef, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesPackagesModule } from "src/assigness-packages-offers/assignes-packages.module";
import { CompanyModule } from "src/companies/company.module";
import { DealsModule } from "src/deals/deals.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { PriceCalculationMiddleware } from "./middleware/price-calculation.middleware";
import { ReservationRoomValidationMiddleware } from "./middleware/reservation-room-validation.middleware";
import { ReservationStatusMiddleware } from "./middleware/reservation-status.middleware";
import { ReservationCalendarService } from "./reservation-calendar.service";
import { ReservationRoomQueryService } from "./reservation-room-query.service";
import { ReservationRoomController } from "./reservation-room.controller";
import { ReservationRoom } from "./reservation-room.entity";
import { ReservationRoomService } from "./reservation-room.service";

@Module({
  imports: [
    GeneralOffer,
    CompanyModule,
    IndividualModule,
    StudentActivityModule,
    RoomsModule,
    DepositesModule,
    AssignGeneralOfferModule,
    GeneralOfferModule,
    UsersModule,
    forwardRef(() => AssignesPackagesModule),
    forwardRef(() => DealsModule),
    TypeOrmModule.forFeature([ReservationRoom]),
    DepositesModule,
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
        ReservationRoomValidationMiddleware,
        PriceCalculationMiddleware,
        ReservationStatusMiddleware,
      )
      .forRoutes(
        "reservation-room/store",
        "reservation-room/store/package",
        "reservation-room/store/deal",
      );
  }
}
