import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { ValidateDateRangeMiddleware } from "src/shared/middleware/validate-date-range.middleware";
import { ValidateOfferRangeMiddleware } from "src/shared/middleware/validate-offer-range.middleware";
import { ValidateOfferMiddleware } from "src/shared/middleware/validate-offer.middleware";
import { ValidatePackageMiddleware } from "src/shared/middleware/validate-package.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { AssignesPackageController } from "./assignes-packages.controller";
import { AssignesPackages } from "./assignes-packages.entity";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CalculatePackagesPriceMiddleware } from "./middleware/calculate-total-price-packages.middleware";
import { CheckActiveAssignessPackagesMiddleware } from "./middleware/check-active-assigness-packages.middleware";

@Module({
  imports: [
    CompanyModule,
    ReservationRoomModule,
    IndividualModule,
    StudentActivityModule,
    AssignGeneralOfferModule,
    GeneralOfferModule,
    OfferPackageModule,
    UsersModule,
    TypeOrmModule.forFeature([AssignesPackages]),
  ],
  controllers: [AssignesPackageController],
  providers: [AssignesPackagesService],
  exports: [AssignesPackagesService],
})
export class AssignesPackagesModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware to store route
    consumer
      .apply(
        ValidateDateRangeMiddleware,
        CustomerMiddleware,
        ValidatePackageMiddleware,
        CheckActiveAssignessPackagesMiddleware,
        ValidateOfferMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        CalculatePackagesPriceMiddleware,
      )
      .forRoutes("assignes-package/store");

    // Apply middleware to update route
    consumer
      .apply(
        ValidateDateRangeMiddleware,
        CustomerMiddleware,
        ValidatePackageMiddleware,
        CheckActiveAssignessPackagesMiddleware,
        ValidateOfferMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        CalculatePackagesPriceMiddleware,
      )
      .forRoutes("assignes-package/update");
  }
}
