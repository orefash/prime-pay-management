import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentsService } from '../../services/agents/agents.service';
import { CreateAgentDto } from 'apps/agent-app/src/dto/CreateAgent.dto';
import { UpdateBankDto } from '@app/db-lib/dto/UpdateBankDetails.dto';
import { EditAgentDto } from 'apps/agent-app/src/dto/EditAgent.dto';

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
            if(agent) delete agent.password;
            return agent;
        } catch (error) {
            throw new HttpException('Failed to retrieve agent wit ID: '+id, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('profile/:id')
    @UsePipes(ValidationPipe)
    async updateAgent(@Param('id') agentId: string, @Body() editAgentDto: EditAgentDto) {
        try {

            console.log("eidt: ", editAgentDto)
            let updatedAgent = await this.agentService.updateAgentProfile(agentId, editAgentDto);

            return {
                success: true,
                agent: updatedAgent
            }
        } catch (error) {
            console.log('update agent error: ', error.message)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Patch('bank-details/:id')
    @UsePipes(ValidationPipe)
    async updateAgentBank(@Param('id') agentId: string, @Body() editAgentBankDto: UpdateBankDto) {
        try {
            let updatedAgent = await this.agentService.updateAgentBank(agentId, editAgentBankDto);

            return {
                success: true,
                agent: updatedAgent
            }
        } catch (error) {
            // console.log('update merchant bank error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }



    @Get(':agentId/balance')
    async getAgentBalance(
        @Param('agentId') agentId: string) {

        try {
            let agent = await this.agentService.getAgentBalance(agentId);

            let data = {
                ...agent,
            };
            return data;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        }

    }





    
}
