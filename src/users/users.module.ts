import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { FilterDateModule } from "src/shared/filters/filter-date.module";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";
@Module({
  imports: [FilterDateModule, TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
