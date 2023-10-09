import { Body, Controller, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsService } from '../../services/agents/agents.service';
import { CreateAgentDto } from 'apps/agent-app/src/dto/CreateAgent.dto';

@Controller('agents')
export class AgentsController {
    constructor(
        private readonly agentService: AgentsService,

    ) { }


    
}
