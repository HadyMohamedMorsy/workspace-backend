import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomsModule } from "src/rooms/rooms.module";
import { OfferPackages } from "./offer-package.entity";
import { OfferPackagesController } from "./offerpackages.controller";
import { OfferPackagesService } from "./offerpackages.service";

@Module({
  imports: [RoomsModule, TypeOrmModule.forFeature([OfferPackages])],
  controllers: [OfferPackagesController],
  providers: [OfferPackagesService],
  exports: [OfferPackagesService],
})
export class OfferPackageModule {}
