import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignesPackageController } from "./assignes-packages.controller";
import { AssignesPackages } from "./assignes-packages.entity";
import { AssignesPackagesService } from "./assignes-packages.service";

@Module({
  imports: [
    OfferPackageModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    TypeOrmModule.forFeature([AssignesPackages]),
  ],
  controllers: [AssignesPackageController],
  providers: [AssignesPackagesService],
  exports: [AssignesPackagesService],
})
export class AssignesPackagesModule {}
