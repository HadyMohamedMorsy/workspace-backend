import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignUserMiddleware } from "src/shared/middleware/assign-user.middleware";
import { UsersModule } from "src/users/users.module";
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
    consumer.apply(AssignUserMiddleware).forRoutes("vacation/store", "vacation/update");
  }
}
