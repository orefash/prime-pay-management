import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AgentAuthService } from '../../services/agent-auth/agent-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import RequestWithAgent from '../../types/requestWithAgent.interface';
import { CreateAgentDto } from '../../../dto/CreateAgent.dto';
import { AgentsService } from '../../../agents/services/agents/agents.service';
import JwtAuthenticationGuard from '../../utils/JWTAuthGuard';
import { RequestPasswordResetDto } from '../../dto/RequestPasswordReset.dto';
import { ResetPasswordDto } from '../../dto/ResetPassword.dto';

@Controller('auth')
export class AgentAuthController {
    constructor(
        @Inject('AGENT_AUTH_SERVICE')
        private readonly agentAuthService: AgentAuthService,
        private readonly agentService: AgentsService,
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithAgent) {
        const agent = request.user;
        agent.password = undefined;
        return agent;
    }

    @Post('register')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createAgentDto: CreateAgentDto,) {

        console.log("in register")
        try {

            let created = await this.agentService.createAgentProfile(createAgentDto);

            return {
                message: "Check your email for confirmation",
                success: true,
                agent: created
            }

        } catch (error) {
            console.log('create Agent Profile error: ', error)
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
        
        return response.send({ success: true, agent, token });
    }


    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithAgent, @Res() response: Response) {
        // console.log('User: ', request.user)
        response.setHeader('Set-Cookie', this.agentAuthService.getCookieForLogOut());
        return response.sendStatus(200);
    }


    @Post('request-password-reset')
    async requestPasswordReset(@Body() requestPasswordDto: RequestPasswordResetDto) {
        try {
            return await this.agentAuthService.requestPasswordReset(requestPasswordDto)
        } catch (error) {
            // console.log('request Password Reset error')
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    
    @Post('reset-password')
    async resetPassword(@Body() resetPassword: ResetPasswordDto) {
        try {
            return await this.agentAuthService.resetPassword(resetPassword)
        } catch (error) {
            // console.log('Password Reset error')
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Get('confirm/:token')
    async confirmToken (@Param('token') token: string, @Res() res: Response){
        try {
            
            let confirmed =  await this.agentAuthService.confirmEmail(token);

            if(confirmed.redirectUrl){
                return res.redirect(confirmed.redirectUrl);
            }
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
