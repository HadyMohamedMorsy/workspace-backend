import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { customerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignGeneralOfferController } from "./assignes-general-offer.controller";
import { AssignGeneralOffer } from "./assignes-general-offer.entity";
import { assign_general_offerservice } from "./assignes-general-offer.service";

@Module({
  imports: [
    GeneralOfferModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    TypeOrmModule.forFeature([AssignGeneralOffer]),
  ],
  controllers: [AssignGeneralOfferController],
  providers: [assign_general_offerservice],
  exports: [assign_general_offerservice],
})
export class AssignGeneralOfferModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerMiddleware).forRoutes("assign-general-offer/store");
  }
}
