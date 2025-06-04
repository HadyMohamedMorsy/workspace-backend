import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomsModule } from "src/rooms/rooms.module";
import { OfferPackagesMiddleware } from "./middleware/offer-packages.middleware";
import { OfferPackages } from "./offer-package.entity";
import { OfferPackagesController } from "./offerpackages.controller";
import { OfferPackagesService } from "./offerpackages.service";

@Module({
  imports: [RoomsModule, TypeOrmModule.forFeature([OfferPackages])],
  controllers: [OfferPackagesController],
  providers: [OfferPackagesService],
  exports: [OfferPackagesService],
})
export class OfferPackageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OfferPackagesMiddleware)
      .forRoutes(
        { path: "packages/store", method: RequestMethod.POST },
        { path: "packages/update", method: RequestMethod.POST },
      );
  }
}
