import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: ".env" });

const config = {
  type: "postgres",
  host: `host`,
  port: `port`,
  username: `database-user`,
  password: `password`,
  database: `database-name`,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/migrations/*{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: false,
};

export const connectionSource = new DataSource(config as DataSourceOptions);
