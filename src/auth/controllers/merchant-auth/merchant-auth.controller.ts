import { Controller, Get, HttpCode, Inject, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MerchantAuthService } from 'src/auth/services/merchant-auth/merchant-auth.service';
import RequestWithMerchant from '../../types/requestWithMerchant.interface';
import JwtAuthenticationGuard from '../../utils/JWTAuthGuard';

@Controller('auth/merchant')
export class MerchantAuthController {
    constructor(
        @Inject('MERCHANT_AUTH_SERVICE')
        private readonly merchantAuthService: MerchantAuthService
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithMerchant) {
        const merchant = request.user;
        merchant.password = undefined;
        return merchant;
    }

    @HttpCode(200)
    @UseGuards(AuthGuard('merchant-local'))
    @Post('login')
    async login(@Req() request: RequestWithMerchant, @Res() response: Response) {
        // const { merchant } = request;
        const merchant = request.user;
        // console.log('mc: ', merchant)
        const cookie = this.merchantAuthService.getCookieWithJwtToken(merchant.id);
        response.setHeader('Set-Cookie', cookie);
        merchant.password = undefined;
        return response.send(merchant);
    }


    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithMerchant, @Res() response: Response) {
        // console.log('User: ', request.user)
        response.setHeader('Set-Cookie', this.merchantAuthService.getCookieForLogOut());
        return response.sendStatus(200);
    }

}
