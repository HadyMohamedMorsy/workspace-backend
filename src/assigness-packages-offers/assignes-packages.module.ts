import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyModule } from "src/companies/company.module";
import { IndividualModule } from "src/individual/individual.module";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { AssignesPackageController } from "./assignes-packages.controller";
import { AssignesPackages } from "./assignes-packages.entity";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CheckActivePackagesMiddleware } from "./middleware/assigness-packages,middleware";

@Module({
  imports: [
    CompanyModule,
    forwardRef(() => ReservationRoomModule),
    IndividualModule,
    StudentActivityModule,
    OfferPackageModule,
    TypeOrmModule.forFeature([AssignesPackages]),
  ],
  controllers: [AssignesPackageController],
  providers: [AssignesPackagesService],
  exports: [AssignesPackagesService],
})
export class AssignesPackagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckActivePackagesMiddleware, CustomerMiddleware)
      .forRoutes("assignes-package/store");
  }
}
