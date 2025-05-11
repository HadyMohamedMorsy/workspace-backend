import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { PasswordMiddleware } from "./middleware/password.middleware";
import { RolePermissionMiddleware } from "./middleware/role-permission.middleware";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Module({
  imports: [FilterDateModule, TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PasswordMiddleware, RolePermissionMiddleware)
      .forRoutes("user/store", "user/update");
  }
}
