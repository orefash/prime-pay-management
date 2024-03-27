import { Body, Controller, HttpException, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from '../../services/admin/admin.service';
import JwtAuthenticationGuard from 'apps/agent-app/src/auth/utils/JWTAuthGuard';
import { UpdateAgentCodeDto } from 'apps/agent-app/src/dto/UpdateAgentCode.dto';

@Controller('agents')
export class AdminController {
    constructor(
        private readonly agentService: AdminService,

    ) { }

    @Post('toggle-agent-active/:id')
    @UseGuards(JwtAuthenticationGuard)
    async activateAgent(@Param('id') agentId: string) {
        try {
            return await this.agentService.toggleAgentActive(agentId);
        } catch (error) {
            console.log('toggle active error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }


    @Post('verify-agent/:id')
    @UseGuards(JwtAuthenticationGuard)
    async verifyMerchant(@Param('id') agentId: string) {
        try {
            return await this.agentService.verifyAgent(agentId);
        } catch (error) {
            console.log('verify error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('confirm-agent/:id')
    // @UseGuards(JwtAuthenticationGuard)
    async confirmAgent(@Param('id') agentId: string) {
        try {
            return await this.agentService.setAgentConfirmed(agentId);
        } catch (error) {
            console.log('SA: confirm error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Patch(':id/agentCode')
    @UsePipes(ValidationPipe)
    async updateAgentCode(@Param('id') agentId: string, @Body() editAgentCode: UpdateAgentCodeDto) {
        try {
            return this.agentService.setAgentCode(agentId, editAgentCode);
        } catch (error) {
            // console.log('update merchant bank error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
