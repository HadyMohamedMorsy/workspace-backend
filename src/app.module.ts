import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import jwtConfig from "./auth/config/jwt.config";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";
import { AuthenticationGuard } from "./auth/guards/authentication/authentication.guard";
import { CompanyModule } from "./companies/company.module";
import { IndividualModule } from "./individual/individual.module";
import { ProductsModule } from "./products/products.module";
import appConfig from "./shared/config/app.config";
import databaseConfig from "./shared/config/database.config";
import { FilterDateModule } from "./shared/filters/filter-date.module";
import { APIFeaturesService } from "./shared/filters/filter.service";
import { TransformInterceptor } from "./shared/interceptor/transform-response.interceptor";
import { listModule } from "./shared/list/list.module";
import { LanMiddleware } from "./shared/middleware/lang.middleware";
import { SearchModule } from "./shared/search-list/search-list.module";
import enviromentValidation from "./shared/validations/env.validation";
import { StudentActivityModule } from "./student-activity/studentActivity.module";
import { UsersModule } from "./users/users.module";

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    CompanyModule,
    listModule,
    SearchModule,
    IndividualModule,
    ProductsModule,
    StudentActivityModule,
    FilterDateModule,
    UsersModule,
    AuthModule,
    CacheModule.register({
      ttl: 5000,
      max: 10,
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env.development', '.env'],
      envFilePath: !ENV ? ".env" : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: enviromentValidation,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/public",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        database: configService.get("database.name"),
        username: configService.get("database.user"),
        password: configService.get("database.password"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    APIFeaturesService,
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LanMiddleware).forRoutes("*");
  }
}
