import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://prim-pay-merchant.netlify.app',
      'http://localhost:5173',
    ],
    // methods: ["GET", "POST"],
    credentials: true,
  });

  app.use(passport.initialize())
  await app.listen(configService.get<number>('PORT') || 3500);
}
bootstrap();
