import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant } from 'src/typeorm';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class MerchantAuthService {
    constructor(
        @Inject('MERCHANTS_SERVICE') private readonly merchantService: MerchantsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    public getCookieWithJwtToken(merchantId: string) {
        const payload: TokenPayload = { merchantId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    async validateMerchant(email: string, password: string) {
        const merchant: Merchant = await this.merchantService.getMerchantByEmail(email);
        if (merchant && comparePasswords(password, merchant.password)) {
            const { password, ...result } = merchant;
            return result;
        }
        return null;
    }

}
