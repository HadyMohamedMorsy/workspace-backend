import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudentActivityController } from "./studentActivity.controller";
import { StudentActivity } from "./StudentActivity.entity";
import { StudentActivityService } from "./studentActivity.service";

@Module({
  imports: [TypeOrmModule.forFeature([StudentActivity])],
  controllers: [StudentActivityController],
  providers: [StudentActivityService],
  exports: [StudentActivityService],
})
export class StudentActivityModule {}
