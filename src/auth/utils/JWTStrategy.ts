
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { MerchantsService } from '../../merchants/services/merchants/merchants.service';
 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    // @Inject('MERCHANTS_SERVICE') 
    @Inject(MerchantsService)
    private readonly merchantService: MerchantsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('x-auth-token'),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }
 
  async validate(payload: TokenPayload) {

    const currentTime = Math.floor(Date.now() / 1000);


    console.log("current time expired: ", currentTime)

    // Check if the token has expired
    if (payload.exp < currentTime) {
      // Token has expired
      console.log("token expired: ", payload.exp)
      throw new HttpException("Token has Expired", HttpStatus.UNAUTHORIZED);
    }
        

    return this.merchantService.getMerchantById(payload.merchantId);
  }
}