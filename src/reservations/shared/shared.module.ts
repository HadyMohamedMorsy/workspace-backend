import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { DepositMiddleware } from "src/shared/middleware/deposit.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { SharedController } from "./shared.controller";
import { Shared } from "./shared.entity";
import { SharedService } from "./shared.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Shared]),
    IndividualModule,
    CompanyModule,
    AssignGeneralOfferModule,
    GeneralOfferModule,
    GeneralSettingsModule,
    AssignesMembershipModule,
    StudentActivityModule,
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
      .apply(CustomerMiddleware, AssignGeneralOfferMiddleware)
      .forRoutes("shared/store", "shared/update")
      .apply(DepositMiddleware)
      .forRoutes("shared/store-deposit");
  }
}
