import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { VacationMiddleware } from "./middleware/vacation.middleware";
import { VacationController } from "./vacation.controller";
import { Vacation } from "./vacation.entity";
import { VacationService } from "./vacation.service";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Vacation])],
  controllers: [VacationController],
  providers: [VacationService],
  exports: [VacationService],
})
export class VacationModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VacationMiddleware).forRoutes("vacation/store", "vacation/update");
  }
}
