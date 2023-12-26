import { NestFactory } from '@nestjs/core';
import { AdminAppModule } from './admin-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminAppModule);
  await app.listen(3000);
}
bootstrap();
