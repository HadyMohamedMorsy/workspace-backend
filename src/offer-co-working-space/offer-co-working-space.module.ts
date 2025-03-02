import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OfferCoWorkingSpaceController } from "./offer-co-working-space.controller.js";
import { CoWorkingSpace } from "./offer-co-working-space.entity";
import { OfferCoWorkingSpaceService } from "./offer-co-working-space.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([CoWorkingSpace])],
  controllers: [OfferCoWorkingSpaceController],
  providers: [OfferCoWorkingSpaceService],
  exports: [OfferCoWorkingSpaceService],
})
export class OfferCoWorkingSpaceModule {}
