import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DealsController } from "./deals.controller";
import { Deals } from "./deals.entity";
import { DealsService } from "./deals.service";

@Module({
  imports: [TypeOrmModule.forFeature([Deals])],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}
