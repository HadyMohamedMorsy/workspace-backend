import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RevenueModule } from "../revenue.module";
import { RevenueChildController } from "./revenue-child.controller";
import { RevenueChild } from "./revenue-child.entity";
import { RevenueChildService } from "./revenue-child.service";

@Module({
  imports: [RevenueModule, TypeOrmModule.forFeature([RevenueChild])],
  controllers: [RevenueChildController],
  providers: [RevenueChildService],
  exports: [RevenueChildService],
})
export class RevenueChildModule {}
