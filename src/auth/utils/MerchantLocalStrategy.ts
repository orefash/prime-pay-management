import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { MerchantAuthService } from "../services/merchant-auth/merchant-auth.service";


@Injectable()
export class MerchantLocalStrategy extends PassportStrategy(Strategy, 'merchant-local') {
    constructor(
        @Inject('MERCHANT_AUTH_SERVICE') private readonly authService: MerchantAuthService,
    ) {
        super(
            {
                usernameField: 'email',
            }
        );
    }

    async validate(email: string, password: string): Promise<any> {
        const merchant = await this.authService.validateMerchant(email, password);
        if(!merchant){
            throw new UnauthorizedException();
        }
        return merchant;
    }

}