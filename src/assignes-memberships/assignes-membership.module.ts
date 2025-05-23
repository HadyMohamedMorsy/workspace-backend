import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { CompanyModule } from "src/companies/company.module";
import { DepositesModule } from "src/deposit/deposites.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferCoWorkingSpaceModule } from "src/offer-co-working-space/offer-co-working-space.module";
import { OfferCoWorkingSpaceMiddleware } from "src/shared/middleware/co-working-space.middleware";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { DepositMiddleware } from "src/shared/middleware/deposit.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { AssignesMembershipController } from "./assignes-membership.controller";
import { AssignesMembership } from "./assignes-membership.entity";
import { AssignesMembershipService } from "./assignes-membership.service";
import { CalculateMembershipPriceMiddleware } from "./middleware/calculate-total-price-membership.middleware";
import { checkAssignMemebershipMiddleware } from "./middleware/check-active-assigness-membership.middleware";

@Module({
  imports: [
    OfferCoWorkingSpaceModule,
    // SharedModule,
    // DeskareaModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    AssignGeneralOfferModule,
    DepositesModule,
    GeneralOfferModule,
    UsersModule,
    TypeOrmModule.forFeature([AssignesMembership]),
  ],
  controllers: [AssignesMembershipController],
  providers: [AssignesMembershipService],
  exports: [AssignesMembershipService],
})
export class AssignesMembershipModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply middleware to store route
    consumer
      .apply(
        CustomerMiddleware,
        OfferCoWorkingSpaceMiddleware,
        checkAssignMemebershipMiddleware,
        CalculateMembershipPriceMiddleware,
      )
      .forRoutes("assignes-membership/store");

    // Apply middleware to update route
    consumer
      .apply(
        CustomerMiddleware,
        OfferCoWorkingSpaceMiddleware,
        checkAssignMemebershipMiddleware,
        CalculateMembershipPriceMiddleware,
      )
      .forRoutes("assignes-membership/update");

    // Apply middleware to store-deposite route
    consumer.apply(DepositMiddleware).forRoutes("assignes-membership/store-deposite");
  }
}
