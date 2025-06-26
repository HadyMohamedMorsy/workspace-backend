import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LookupController } from "./lookup.controller";
import { Lookup } from "./lookup.entity";
import { LookupMiddleware } from "./lookup.middleware";
import { LookupService } from "./lookup.service";

@Module({
  imports: [TypeOrmModule.forFeature([Lookup])],
  controllers: [LookupController],
  providers: [LookupService],
  exports: [LookupService],
})
export class LookupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LookupMiddleware).forRoutes("lookup/store", "lookup/update");
  }
}
