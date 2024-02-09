import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,

      // transform: true,
      // whitelist: true,
      // forbidNonWhitelisted: true,
      // forbidUnknownValues: true,
      // whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
