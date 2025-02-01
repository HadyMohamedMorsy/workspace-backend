import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettings } from "./general-settings.entity";
import { GeneralSettingsController } from "./settings.controller";
import { GeneralSettingsService } from "./settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([GeneralSettings])],
  controllers: [GeneralSettingsController],
  providers: [GeneralSettingsService],
  exports: [GeneralSettingsService],
})
export class GeneralSettingsModule {}
