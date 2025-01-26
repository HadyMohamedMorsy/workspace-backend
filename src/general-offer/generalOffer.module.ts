import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralOfferController } from "./generalOffer.controller";
import { GeneralOffer } from "./generalOffer.entity";
import { GeneralOfferService } from "./generalOffer.service";

@Module({
  imports: [TypeOrmModule.forFeature([GeneralOffer])],
  controllers: [GeneralOfferController],
  providers: [GeneralOfferService],
  exports: [GeneralOfferService],
})
export class GeneralOfferModule {}
