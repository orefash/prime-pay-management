import { Controller, Get } from '@nestjs/common';
import { AgentAppService } from './agent-app.service';

@Controller()
export class AgentAppController {
  constructor(private readonly agentAppService: AgentAppService) {}

  @Get()
  getHello(): string {
    return this.agentAppService.getHello();
  }
}
