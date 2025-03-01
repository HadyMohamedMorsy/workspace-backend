import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { AssignGeneralOfferController } from "./assignes-general-offer.controller";
import { AssignGeneralOffer } from "./assignes-general-offer.entity";
import { AssignGeneralOfferservice } from "./assignes-general-offer.service";

@Module({
  imports: [
    GeneralOfferModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    UsersModule,
    TypeOrmModule.forFeature([AssignGeneralOffer]),
  ],
  controllers: [AssignGeneralOfferController],
  providers: [AssignGeneralOfferservice],
  exports: [AssignGeneralOfferservice],
})
export class AssignGeneralOfferModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes("assign-general-offer/store");
  }
}
