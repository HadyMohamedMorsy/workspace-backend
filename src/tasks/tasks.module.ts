import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignUserMiddleware } from "src/shared/middleware/assign-user.middleware";
import { UsersModule } from "src/users/users.module";
import { TaskController } from "./tasks.controller";
import { Task } from "./tasks.entity";
import { TaskService } from "./tasks.service";

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AssignUserMiddleware).forRoutes("task/store", "task/update");
  }
}
