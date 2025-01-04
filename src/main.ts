import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./shared/filters/http-exception.filter";
dotenv.config({ path: ".env.pro" });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("/api/v1");
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
