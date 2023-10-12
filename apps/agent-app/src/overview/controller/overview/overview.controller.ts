import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { OverviewService } from '../../services/overview/overview.service';
// import JwtAuthenticationGuard from '../../../auth/utils/JWTAuthGuard';

@Controller('overview')
export class OverviewController {
    constructor(
        private readonly overviewService: OverviewService
    ){}

    @Get('agent/:agentCode')
    async getMerchantOverview (@Param('agentCode') agentCode: string, @Query() queryParams: any){
        try {
            // let isTest = null;

            // if(queryParams.isTest){
            //    isTest = queryParams.isTest;
            // }else{
            //     throw new Error("Missing isTest value!!")
            // }

            return await this.overviewService.getOverviewData(agentCode);
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
