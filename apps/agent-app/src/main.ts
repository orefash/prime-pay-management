import { NestFactory } from '@nestjs/core';
import { AgentAppModule } from './agent-app.module';

async function bootstrap() {
  const app = await NestFactory.create(AgentAppModule);
  await app.listen(3000);
}
bootstrap();
