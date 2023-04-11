import { Inject, Injectable } from '@nestjs/common';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant } from 'src/typeorm';

@Injectable()
export class MerchantAuthService {
    constructor(
        @Inject('MERCHANTS_SERVICE') private readonly merchantService: MerchantsService,
    )
    {}

    async validateMerchant(email: string, password: string){
        const merchant: Merchant = await this.merchantService.getMerchantByEmail(email);
        if(merchant && merchant.password === password){
            const { password, ...result } = merchant;
            return result;
        } 
        return null;
    }

}
