import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGINS?.split(",") || [];
  app.enableCors({
    origin: (origin, callback) => {
      // If no origin (e.g. mobile apps or curl requests) allow it
      if (!origin) return callback(null, true);

      if (corsOrigins.includes("*") || corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix("api");

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle("DhanWarsha Slot API")
    .setDescription("The official API for DhanWarsha Slot Betting Game")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(8001, "0.0.0.0");
  console.log(`🚀 Application is running on: http://localhost:8001`);
  console.log(`📄 Swagger Docs available at: http://localhost:8001/api/docs`);
}

bootstrap();
