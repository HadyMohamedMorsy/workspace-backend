import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesPackagesModule } from "src/assigness-packages-offers/assignes-packages.module";
import { CompanyModule } from "src/companies/company.module";
import { DealsModule } from "src/deals/deals.module";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
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
    AssignGeneralOfferModule,
    GeneralOfferModule,
    forwardRef(() => AssignesPackagesModule),
    DealsModule,
    TypeOrmModule.forFeature([ReservationRoom]),
  ],
  controllers: [ReservationRoomController],
  providers: [ReservationRoomService],
  exports: [ReservationRoomService],
})
export class ReservationRoomModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerMiddleware)
      .forRoutes(
        "reservation-room/store",
        "reservation-room/store/package",
        "reservation-room/store/deal",
      );
  }
}
