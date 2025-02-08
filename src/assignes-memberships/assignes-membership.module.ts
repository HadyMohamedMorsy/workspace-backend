import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferCoWorkingSpaceModule } from "src/offer-co-working-space/offer-co-working-space.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignesMembershipController } from "./assignes-membership.controller";
import { AssignesMembership } from "./assignes-membership.entity";
import { AssignesMembershipService } from "./assignes-membership.service";
import { CheckActiveMembershipMiddleware } from "./middleware/check-active-assigness-membership";

@Module({
  imports: [
    OfferCoWorkingSpaceModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
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
