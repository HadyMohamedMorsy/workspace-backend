import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { CompanyModule } from "src/companies/company.module";
import { Individual } from "src/individual/individual.entity";
import { IndividualModule } from "src/individual/individual.module";
import { CustomerMiddleware } from "src/shared/middleware/customer.middleware";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { StudentActivityModule } from "src/student-activity/studentActivity.module";
import { UsersModule } from "src/users/users.module";
import { CustomSettingsController } from "./custom-settings.controller";
import { CustomSettings } from "./custom-settings.entity";
import { CustomSettingsService } from "./custom-settings.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomSettings, Individual, Company, StudentActivity]),
    IndividualModule,
    CompanyModule,
    StudentActivityModule,
    UsersModule,
  ],
  controllers: [CustomSettingsController],
  providers: [CustomSettingsService],
  exports: [CustomSettingsService],
})
export class CustomSettingsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CustomerMiddleware)
      .forRoutes("custom-settings/user", "custom-settings/store", "custom-settings/update");
  }
}
