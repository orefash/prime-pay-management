import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { PaystackService } from 'src/third-party-data/services/paystack-service/paystack-service.service';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';

@Controller('3d')
export class ThirdPartyDataController {
    constructor(
        private readonly tdService: ThirdPartyDataService,
        private readonly paystackService: PaystackService
    ){}

    @Get('banks')
    // @UseGuards(JwtAuthenticationGuard)
    async getBankList(){
        return await this.tdService.getBankList();
    }

    @Get('paystack-banks')
    // @UseGuards(JwtAuthenticationGuard)
    async getPaystackBankList(){
        // return await this.paystackService.getPaystackBank();
        return "done"
    }

}
