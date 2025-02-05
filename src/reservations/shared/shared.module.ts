import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { customerMiddleware } from "src/shared/middleware/customer.middleware";
import { SharedController } from "./shared.controller";
import { Shared } from "./shared.entity";
import { SharedService } from "./shared.service";

@Module({
  imports: [TypeOrmModule.forFeature([Shared])],
  controllers: [SharedController],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(customerMiddleware).forRoutes("shared/store");
  }
}
