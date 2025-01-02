import { Global, Module } from "@nestjs/common";
import { APIFeaturesService } from "./filter.service";
@Global() // Marks this module as global
@Module({
  providers: [APIFeaturesService],
  exports: [APIFeaturesService],
})
export class FilterDateModule {}
