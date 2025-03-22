import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AttendController } from "./attend.controller";
import { Attend } from "./attend.entity";
import { AttendService } from "./attend.service";

@Module({
  imports: [TypeOrmModule.forFeature([Attend])],
  controllers: [AttendController],
  providers: [AttendService],
  exports: [AttendService],
})
export class AttendModule {}
