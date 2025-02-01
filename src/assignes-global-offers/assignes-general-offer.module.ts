import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { IndividualModule } from "src/individual/individual.module";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignGeneralOfferController } from "./assignes-general-offer.controller";
import { AssignGeneralOffer } from "./assignes-general-offer.entity";
import { AssignGeneralOfferService } from "./assignes-general-offer.service";

@Module({
  imports: [
    GeneralOfferModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    TypeOrmModule.forFeature([AssignGeneralOffer]),
  ],
  controllers: [AssignGeneralOfferController],
  providers: [AssignGeneralOfferService],
  exports: [AssignGeneralOfferService],
})
export class AssignGeneralOfferModule {}
