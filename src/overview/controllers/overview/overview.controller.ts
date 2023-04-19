import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { OverviewService } from 'src/overview/services/overview/overview.service';

@Controller('overview')
export class OverviewController {
    constructor(
        private readonly overviewService: OverviewService
    ){}

    @Get('merchant/:mid')
    @UseGuards(JwtAuthenticationGuard)
    async getMerchantOverview (@Param('mid') mid: string){
        return await this.overviewService.getOverviewData(mid);
    }
}
