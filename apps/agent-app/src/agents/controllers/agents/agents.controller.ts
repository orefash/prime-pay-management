import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
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

    @Get(':id')
    async getAgentById(@Param('id') id: string,) {
        try {
            const agent = await this.agentService.getAgentByField("id", id);
            return agent;
        } catch (error) {
            throw new HttpException('Failed to retrieve agent wit ID: '+id, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}
