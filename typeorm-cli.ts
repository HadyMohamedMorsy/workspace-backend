import { ConfigService, registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
dotenvConfig({ path: ".env.pro" });

const configService = new ConfigService();
const config = {
  type: "postgres",
  host: configService.get<string>("DATABASE_HOST"),
  port: configService.get<string>("DATABASE_PORT"),
  username: configService.get<string>("DATABASE_USER"),
  password: configService.get<string>("DATABASE_PASSWORD"),
  database: configService.get<string>("DATABASE_NAME"),
  synchronize: false,
  entities: [__dirname + "/src/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/src/migrations/*{.ts,.js}"],
  autoLoadEntities: true,
};

export default registerAs("typeorm", () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
