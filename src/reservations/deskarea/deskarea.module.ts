import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOfferModule } from "src/assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { DeskareaController } from "./deskarea.controller";
import { Deskarea } from "./deskarea.entity";
import { DeskareaService } from "./deskarea.service";

@Module({
  imports: [
    CompanyModule,
    IndividualModule,
    StudentActivityModule,
    AssignGeneralOfferModule,
    AssignesMembershipModule,
    TypeOrmModule.forFeature([Deskarea]),
  ],
  controllers: [DeskareaController],
  providers: [DeskareaService],
  exports: [DeskareaService],
})
export class DeskareaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes("deskarea/store");
  }
}
