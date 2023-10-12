import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsService } from '../../services/agents/agents.service';
import { CreateAgentDto } from 'apps/agent-app/src/dto/CreateAgent.dto';

@Controller('agents')
export class AgentsController {
    constructor(
        private readonly agentService: AgentsService,

    ) { }

    @Get('')
    async getAllAgents() {
        try {
            const agents = await this.agentService.getAllAgents();
            return agents;
        } catch (error) {
            throw new HttpException('Failed to retrieve agents', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}
