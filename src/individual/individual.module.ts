import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { LookupModule } from "src/lookups/lookup.module";
import { LookupListMiddleware } from "src/shared/middleware/lookup.middleware";
import { IndividualController } from "./individual.controller";
import { Individual } from "./individual.entity";
import { IndividualService } from "./individual.service";

@Module({
  imports: [GeneralSettingsModule, LookupModule, TypeOrmModule.forFeature([Individual])],
  controllers: [IndividualController],
  providers: [IndividualService],
  exports: [IndividualService],
})
export class IndividualModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LookupListMiddleware).forRoutes("individual/update", "individual/store");
  }
}
