import { NestFactory } from '@nestjs/core';
import { AgentAppModule } from './agent-app.module';

import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AgentAppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('agent-api');
  
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: [
      // 'https://prim-pay-merchant.netlify.app',
      'http://localhost:5173',
      // 'http://localhost:3001',
      // 'http://127.0.0.1:3001',
      // 'http://127.0.0.1:5500',
      // 'http://127.0.0.1:5502',
      // 'https://uat.merchant.prime-pay.africa',
      'https://prime-pay-agent.vercel.app',
      'http://127.0.0.1:5173',
      // 'https://prime-merchant-v.bots.prime-pay.africa'
      // 'https://checkout.prime-pay.africa',
      // 'https://uat.prime-pay.africa',
      // 'https://www.uat.prime-pay.africa',
      // 'https://prime-pay-merchant-lgr079o1v-orefash.vercel.app'
    ],
    // methods: ["GET", "POST"],
    credentials: true,
  });
  app.use(compression());

  app.use(passport.initialize())
  await app.listen(3200);
  // await app.listen(configService.get<number>('PORT') || 3200);
}
bootstrap();
