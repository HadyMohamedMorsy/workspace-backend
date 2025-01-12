import { Global, Module } from "@nestjs/common";
import { ListController } from "./list-controller";
import { ListService } from "./list.service";

@Global() // Marks this module as global
@Module({
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class listModule {}
