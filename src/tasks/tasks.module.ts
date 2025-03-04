import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { TaskMiddleware } from "./middleware/task.middleware";
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
    consumer.apply(TaskMiddleware).forRoutes("task/store", "task/update");
  }
}
