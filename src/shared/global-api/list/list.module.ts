import { Global, Module } from "@nestjs/common";
import { CategoryModule } from "src/categories/category.module";
import { GeneralOfferModule } from "src/general-offer/generalOffer.module";
import { OfferCoWorkingSpaceModule } from "src/offer-co-working-space/offer-co-working-space.module";
import { OfferPackageModule } from "src/offer-packages/offerpackages.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { UsersModule } from "src/users/users.module";
import { ListController } from "./list-controller";
import { ListService } from "./list.service";

@Global() // Marks this module as global
@Module({
  imports: [
    UsersModule,
    OfferPackageModule,
    CategoryModule,
    OfferCoWorkingSpaceModule,
    GeneralOfferModule,
    RoomsModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class listModule {}
