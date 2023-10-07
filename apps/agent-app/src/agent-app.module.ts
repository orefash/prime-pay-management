import { Module } from '@nestjs/common';
import { AgentAppController } from './agent-app.controller';
import { AgentAppService } from './agent-app.service';

@Module({
  imports: [],
  controllers: [AgentAppController],
  providers: [AgentAppService],
})
export class AgentAppModule {}
