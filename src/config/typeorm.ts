import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

const configService = new ConfigService();
const config = {
  type: "postgres",
  host: configService.get<string>("DATABASE_HOST"),
  port: parseInt(configService.get<string>("DATABASE_PORT"), 5432),
  username: configService.get<string>("DATABASE_USER"),
  password: configService.get<string>("DATABASE_PASSWORD"),
  database: configService.get<string>("DATABASE_NAME"),
  synchronize: false,
  entities: [__dirname + "/src/**/*.entity{.ts,.js}"],
  migrations: ["src/database/migrations/*-migration.ts"],
  migrationsRun: false,
  logging: true,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
