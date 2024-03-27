import { Controller, Get } from '@nestjs/common';
import { PaystackService } from '../../services/paystack/paystack.service';

@Controller('paystack')
export class PaystackController {
    constructor(
        // private readonly tdService: ThirdPartyDataService,
        private readonly paystackService: PaystackService
    ) { }

    @Get('banks')
    // @UseGuards(JwtAuthenticationGuard)
    async getPaystackBankList(){
        return await this.paystackService.getBankList();
        // return "done"
    }

}
