import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { IndividualController } from "./individual.controller";
import { Individual } from "./individual.entity";
import { IndividualService } from "./individual.service";

@Module({
  imports: [GeneralSettingsModule, TypeOrmModule.forFeature([Individual])],
  controllers: [IndividualController],
  providers: [IndividualService],
  exports: [IndividualService],
})
export class IndividualModule {}
