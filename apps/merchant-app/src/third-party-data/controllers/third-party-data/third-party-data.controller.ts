import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { PaystackService } from '../../services/paystack-service/paystack-service.service';
import { ThirdPartyDataService } from '../../services/third-party-data/third-party-data.service';

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
        return await this.paystackService.getBankList();
        // return "done"
    }

}
