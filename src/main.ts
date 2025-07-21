import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: true
  },);
  app.useBodyParser('text');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
