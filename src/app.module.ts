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
import { AssignGeneralOfferModule } from "./assignes-global-offers/assignes-general-offer.module";
import { AssignesMembershipModule } from "./assignes-memberships/assignes-membership.module";
import { assignes_packagesModule } from "./assigness-packages-offers/assignes-packages.module";
import { AuthModule } from "./auth/auth.module";
import jwtConfig from "./auth/config/jwt.config";
import { AccessTokenGuard } from "./auth/guards/access-token/access-token.guard";
import { AuthenticationGuard } from "./auth/guards/authentication/authentication.guard";
import { CategoryModule } from "./categories/category.module";
import { CompanyModule } from "./companies/company.module";
import { DashboredModule } from "./dahsbored/dashbored.module";
import { DealsModule } from "./deals/deals.module";
import { ExpensesPlaceModule } from "./expenses-place/expense-place.module";
import { ExpensesPlaceChildModule } from "./expenses-place/expenses-place-child/expense-place-child.module";
import { ExpensesSalariesModule } from "./expenses-salary/expense-salaries.module";
import { GeneralOfferModule } from "./general-offer/generalOffer.module";
import { GeneralSettingsModule } from "./general-settings/settings.module";
import { IndividualModule } from "./individual/individual.module";
import { OfferCoWorkingSpaceModule } from "./offer-co-working-space/offer-co-working-space.module";
import { OfferPackageModule } from "./offer-packages/offerpackages.module";
import { OrdersModule } from "./orders/orders.module";
import { ProductsModule } from "./products/products.module";
import { PurchasesModule } from "./purchases/purchases.module";
import { DeskareaModule } from "./reservations/deskarea/deskarea.module";
import { ReservationRoomModule } from "./reservations/rooms/reservation-room.module";
import { SharedModule } from "./reservations/shared/shared.module";
import { ReturnsModule } from "./returns/returns.module";
import { RoomsModule } from "./rooms/rooms.module";
import appConfig from "./shared/config/app.config";
import databaseConfig from "./shared/config/database.config";
import { FilterDateModule } from "./shared/filters/filter-date.module";
import { APIFeaturesService } from "./shared/filters/filter.service";
import { listModule } from "./shared/global-api/list/list.module";
import { SearchModule } from "./shared/global-api/search-list/search-list.module";
import { UploadsModule } from "./shared/global-api/uploads/uploads.module";
import { TransformInterceptor } from "./shared/interceptor/transform-response.interceptor";
import { LanMiddleware } from "./shared/middleware/lang.middleware";
import enviromentValidation from "./shared/validations/env.validation";
import { StudentActivityModule } from "./student-activity/studentActivity.module";
import { TaskModule } from "./tasks/tasks.module";

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    UploadsModule,
    CompanyModule,
    DashboredModule,
    OfferPackageModule,
    RoomsModule,
    listModule,
    SearchModule,
    GeneralOfferModule,
    GeneralSettingsModule,
    TaskModule,
    assignes_packagesModule,
    DeskareaModule,
    ReservationRoomModule,
    SharedModule,
    AssignGeneralOfferModule,
    AssignesMembershipModule,
    OfferCoWorkingSpaceModule,
    DealsModule,
    IndividualModule,
    ExpensesSalariesModule,
    ExpensesPlaceChildModule,
    ExpensesPlaceModule,
    CategoryModule,
    ReturnsModule,
    PurchasesModule,
    ProductsModule,
    OrdersModule,
    StudentActivityModule,
    FilterDateModule,
    // UsersModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),
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
