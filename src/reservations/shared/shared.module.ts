import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { IndividualModule } from "src/individual/individual.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { CompanyModule } from "./../../companies/company.module";
import { SharedController } from "./shared.controller";
import { Shared } from "./shared.entity";
import { SharedService } from "./shared.service";

@Module({
  imports: [
    CompanyModule,
    IndividualModule,
    StudentActivityModule,
    AssignGeneralOfferModule,
    AssignesMembershipModule,
    TypeOrmModule.forFeature([Shared]),
  ],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes("shared/store");
  }
}
