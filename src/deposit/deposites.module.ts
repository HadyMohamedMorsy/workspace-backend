import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepositesController } from "./deposites.controller";
import { Deposite } from "./deposites.entity";
import { DepositeService } from "./deposites.service";

@Module({
  imports: [TypeOrmModule.forFeature([Deposite])],
  controllers: [DepositesController],
  providers: [DepositeService],
  exports: [DepositeService],
})
export class DepositesModule {}
