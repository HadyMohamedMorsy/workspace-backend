import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { CompanyController } from "./company.controller";
import { Company } from "./company.entity";
import { CompanyService } from "./company.service";

@Module({
  imports: [TypeOrmModule.forFeature([Company]), GeneralSettingsModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
