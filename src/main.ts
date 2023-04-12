import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'https://prim-pay-merchant.netlify.app',
      'http://localhost:5173',
      // 'http://www.example.com',
      // 'http://app.example.com',
      // 'https://example.com',
      // 'https://www.example.com',
      // 'https://app.example.com',
    ],
    // methods: ["GET", "POST"],
    credentials: true,
  });

  app.use(passport.initialize())
  await app.listen(configService.get<number>('PORT') || 3500);
}
bootstrap();
