import { Global, Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { ListController } from "./list-controller";
import { ListService } from "./list.service";

@Global() // Marks this module as global
@Module({
  imports: [UsersModule],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class listModule {}
