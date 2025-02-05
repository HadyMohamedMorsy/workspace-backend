import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { customerMiddleware } from "src/shared/middleware/customer.middleware";
import { AssignesPackageController } from "./assignes-packages.controller";
import { AssignesPackages } from "./assignes-packages.entity";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CheckActivePackagesMiddleware } from "./middleware/assigness-packages,middleware";

@Module({
  imports: [OfferPackageModule, TypeOrmModule.forFeature([AssignesPackages])],
  controllers: [AssignesPackageController],
  providers: [AssignesPackagesService],
  exports: [AssignesPackagesService],
})
export class assignesPackagesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckActivePackagesMiddleware, customerMiddleware)
      .forRoutes("assignes-package/store");
  }
}
