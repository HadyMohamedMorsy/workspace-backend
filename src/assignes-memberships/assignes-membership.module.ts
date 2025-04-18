import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferCoWorkingSpaceModule } from "src/offer-co-working-space/offer-co-working-space.module";
import { DeskareaModule } from "src/reservations/deskarea/deskarea.module";
import { SharedModule } from "src/reservations/shared/shared.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { AssignesMembershipController } from "./assignes-membership.controller";
import { AssignesMembership } from "./assignes-membership.entity";
import { AssignesMembershipService } from "./assignes-membership.service";
import { CheckActiveMembershipMiddleware } from "./middleware/check-active-assigness-membership";

@Module({
  imports: [
    OfferCoWorkingSpaceModule,
    forwardRef(() => SharedModule),
    forwardRef(() => DeskareaModule),
    IndividualModule,
    CompanyModule,
    AssignGeneralOfferModule,
    DepositesModule,
    GeneralOfferModule,
    StudentActivityModule,
    UsersModule,
    TypeOrmModule.forFeature([AssignesMembership]),
  ],
  controllers: [AssignesMembershipController],
  providers: [AssignesMembershipService],
  exports: [AssignesMembershipService],
})
export class AssignesMembershipModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckActiveMembershipMiddleware, CustomerMiddleware)
      .forRoutes("assignes-membership/store");
  }
}
