import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { LookupModule } from "src/lookups/lookup.module";
import { LookupListMiddleware } from "src/shared/middleware/lookup.middleware";
import { CompanyController } from "./company.controller";
import { Company } from "./company.entity";
import { CompanyService } from "./company.service";

@Module({
  imports: [TypeOrmModule.forFeature([Company]), GeneralSettingsModule, LookupModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LookupListMiddleware).forRoutes("company/update", "company/store");
  }
}
