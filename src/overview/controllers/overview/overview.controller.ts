import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { OverviewService } from 'src/overview/services/overview/overview.service';

@Controller('overview')
export class OverviewController {
    constructor(
        private readonly overviewService: OverviewService
    ){}

    @Get('merchant/:mid')
    @UseGuards(JwtAuthenticationGuard)
    async getMerchantOverview (@Param('mid') mid: string, @Query() queryParams: any){
        try {
            let isTest = null;

            if(queryParams.isTest){
               isTest = queryParams.isTest;
            }else{
                throw new Error("Missing isTest value!!")
            }

            return await this.overviewService.getOverviewData(mid, isTest);
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
