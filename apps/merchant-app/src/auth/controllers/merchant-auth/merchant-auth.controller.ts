import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RequestPasswordResetDto } from '../../dto/RequestPasswordReset.dto';
import { ResetPasswordDto } from '../../dto/ResetPassword.dto';
import { MerchantAuthService } from '../../services/merchant-auth/merchant-auth.service';
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
        // console.log('mc: ', request)
        const token = this.merchantAuthService.getJwtToken(merchant.id);
        merchant.password = undefined;

        if(merchant.logoUrl){
            const logoUrl = `${request.protocol}://${request.headers.host}/api/merchants/${merchant.id}/logo`;

            merchant.logoUrl = logoUrl;
        }
        
        return response.send({ merchant, token });
    }



    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithMerchant, @Res() response: Response) {
        // console.log('User: ', request.user)
        response.setHeader('Set-Cookie', this.merchantAuthService.getCookieForLogOut());
        return response.sendStatus(200);
    }


    // @UseGuards(JwtAuthenticationGuard)
    @Post('request-password-reset')
    async requestPasswordReset(@Body() requestPasswordDto: RequestPasswordResetDto) {
        try {
            return await this.merchantAuthService.requestPasswordReset(requestPasswordDto)
        } catch (error) {
            // console.log('request Password Reset error')
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPassword: ResetPasswordDto) {
        try {
            return await this.merchantAuthService.resetPassword(resetPassword)
        } catch (error) {
            // console.log('Password Reset error')
            // console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('confirm/:token')
    async confirmToken (@Param('token') token: string, @Res() res: Response){
        try {
            
            let confirmed =  await this.merchantAuthService.confirmEmail(token);

            if(confirmed.redirectUrl){
                return res.redirect(confirmed.redirectUrl);
            }
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
