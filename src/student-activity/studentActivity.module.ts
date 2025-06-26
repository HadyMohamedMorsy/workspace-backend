import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { LookupModule } from "src/lookups/lookup.module";
import { LookupListMiddleware } from "src/shared/middleware/lookup.middleware";
import { StudentActivityController } from "./studentActivity.controller";
import { StudentActivity } from "./StudentActivity.entity";
import { StudentActivityService } from "./studentActivity.service";

@Module({
  imports: [GeneralSettingsModule, LookupModule, TypeOrmModule.forFeature([StudentActivity])],
  controllers: [StudentActivityController],
  providers: [StudentActivityService],
  exports: [StudentActivityService],
})
export class StudentActivityModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LookupListMiddleware)
      .forRoutes("student-activity/update", "student-activity/store");
  }
}
