import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import { DatabaseExceptionFilter } from "./shared/global-erros/database-error.filter";
import { HttpExceptionFilter } from "./shared/global-erros/http-exception.filter";
dotenv.config({ path: ".env.pro" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("/api/v1");
  app.useGlobalFilters(new DatabaseExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
