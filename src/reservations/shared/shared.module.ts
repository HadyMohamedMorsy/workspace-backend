import { MiddlewareConsumer, Module, NestModule, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { CompanyModule } from "src/companies/company.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { IndividualModule } from "src/individual/individual.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { DateFormatMiddleware } from "src/shared/middleware/date-format.middleware";
import { DepositMiddleware } from "src/shared/middleware/deposit.middleware";
import { ValidateOfferRangeMiddleware } from "src/shared/middleware/validate-offer-range.middleware";
import { ValidateOfferMiddleware } from "src/shared/middleware/validate-offer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { SharedReservationValidationMiddleware } from "./middleware/shared-reservation-validation.middleware";
import { SharedController } from "./shared.controller";
import { Shared } from "./shared.entity";
import { SharedService } from "./shared.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Shared]),
    forwardRef(() => IndividualModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => StudentActivityModule),
    AssignGeneralOfferModule,
    GeneralOfferModule,
    GeneralSettingsModule,
    AssignesMembershipModule,
    DepositesModule,
    UsersModule,
  ],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CustomerMiddleware,
        ValidateOfferMiddleware,
        DateFormatMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
      )
      .forRoutes("shared/update")
      .apply(
        CustomerMiddleware,
        ValidateOfferMiddleware,
        DateFormatMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        SharedReservationValidationMiddleware,
      )
      .forRoutes("shared/store")
      .apply(DepositMiddleware)
      .forRoutes("shared/store-deposit");
  }
}
