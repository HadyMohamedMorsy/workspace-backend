import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RevenueController } from "./revenue.controller";
import { Revenue } from "./revenue.entity";
import { RevenueService } from "./revenue.service";

@Module({
  imports: [TypeOrmModule.forFeature([Revenue])],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService],
})
export class RevenueModule {}
