import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { IndividualModule } from "src/individual/individual.module";
import { AssignGeneralOfferMiddleware } from "src/shared/middleware/assign-general-offer.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { DeskareaController } from "./deskarea.controller";
import { Deskarea } from "./deskarea.entity";
import { DeskareaService } from "./deskarea.service";
import { DepositMiddleware } from "./middleware/deposit.middleware";

@Module({
  imports: [
    forwardRef(() => AssignesMembershipModule),
    CompanyModule,
    IndividualModule,
    GeneralSettingsModule,
    StudentActivityModule,
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
      .apply(CustomerMiddleware, AssignGeneralOfferMiddleware)
      .forRoutes("deskarea/store", "deskarea/update")
      .apply(DepositMiddleware)
      .forRoutes("deskarea/store-deposit");
  }
}
