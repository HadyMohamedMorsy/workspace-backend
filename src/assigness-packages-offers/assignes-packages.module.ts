import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { customerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignesPackageController } from "./assignes-packages.controller";
import { assignes_packages } from "./assignes-packages.entity";
import { assignes_packagesService } from "./assignes-packages.service";

@Module({
  imports: [
    OfferPackageModule,
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    TypeOrmModule.forFeature([assignes_packages]),
  ],
  controllers: [AssignesPackageController],
  providers: [assignes_packagesService],
  exports: [assignes_packagesService],
})
export class assignes_packagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerMiddleware).forRoutes("assignes-package/store");
  }
}
