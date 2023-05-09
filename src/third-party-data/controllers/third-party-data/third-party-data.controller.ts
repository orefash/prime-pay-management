import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';

@Controller('3d')
export class ThirdPartyDataController {
    constructor(
        private readonly tdService: ThirdPartyDataService
    ){}

    @Get('banks')
    @UseGuards(JwtAuthenticationGuard)
    async getBankList(){
        return await this.tdService.getBankList();
    }

    

}
