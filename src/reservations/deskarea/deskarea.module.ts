import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { IndividualModule } from "src/individual/individual.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { AssignesMembershipMiddleware } from "src/shared/middleware/assigness/assignes-membership.middleware";
import { DeskareaMiddleware } from "src/shared/middleware/co-working-space-reservations/deskarea.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { DateFormatMiddleware } from "src/shared/middleware/date-format.middleware";
import { UpdateMembershipUsageMiddleware } from "src/shared/middleware/remaining/update-membership-usage.middleware";
import { ValidateOfferRangeMiddleware } from "src/shared/middleware/validate-offer-range.middleware";
import { ValidateOfferMiddleware } from "src/shared/middleware/validate-offer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { DeskareaController } from "./deskarea.controller";
import { Deskarea } from "./deskarea.entity";
import { DeskareaService } from "./deskarea.service";
import { DeskareaReservationValidationMiddleware } from "./middleware/deskarea-reservation-validation.middleware";

@Module({
  imports: [
    AssignesMembershipModule,
    forwardRef(() => CompanyModule),
    forwardRef(() => IndividualModule),
    GeneralSettingsModule,
    forwardRef(() => StudentActivityModule),
    AssignGeneralOfferModule,
    GeneralOfferModule,
    UsersModule,
    TypeOrmModule.forFeature([Deskarea]),
  ],
  controllers: [DeskareaController],
  providers: [DeskareaService],
  exports: [DeskareaService],
})
export class DeskareaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CustomerMiddleware,
        DateFormatMiddleware,
        DeskareaReservationValidationMiddleware,
        ValidateOfferMiddleware,
        ValidateOfferRangeMiddleware,
        AssignGeneralOfferMiddleware,
        AssignesMembershipMiddleware,
        UpdateMembershipUsageMiddleware,
      )
      .forRoutes("deskarea/store")
      .apply(DeskareaMiddleware)
      .forRoutes("deskarea/deposit");

    consumer
      .apply(AssignesMembershipMiddleware, UpdateMembershipUsageMiddleware)
      .forRoutes("deskarea/change-status");
  }
}
