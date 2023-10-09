import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentAuthService } from '../../services/agent-auth/agent-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import RequestWithAgent from '../../types/requestWithAgent.interface';
import { CreateAgentDto } from '../../../dto/CreateAgent.dto';
import { AgentsService } from '../../../agents/services/agents/agents.service';

@Controller('auth')
export class AgentAuthController {
    constructor(
        @Inject('AGENT_AUTH_SERVICE')
        private readonly agentAuthService: AgentAuthService,
        private readonly agentService: AgentsService,
    ) { }

    @Post('register')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createAgentDto: CreateAgentDto,) {

        try {

            let created = await this.agentService.createAgentProfile(createAgentDto);

            return {
                message: "Check your email for confirmation",
                success: true,
                agent: created
            }

        } catch (error) {
            // console.log('create Merchant Profile error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('agent-local'))
    @Post('login')
    async login(@Req() request: RequestWithAgent, @Res() response: Response) {
        // const { merchant } = request;
        const agent = request.user;
        // console.log('mc: ', request)
        const token = this.agentAuthService.getJwtToken(agent.id);
        agent.password = undefined;

        // if(merchant.logoUrl){
        //     const logoUrl = `${request.protocol}://${request.headers.host}/api/merchants/${merchant.id}/logo`;

        //     merchant.logoUrl = logoUrl;
        // }
        
        return response.send({ agent, token });
    }





}
