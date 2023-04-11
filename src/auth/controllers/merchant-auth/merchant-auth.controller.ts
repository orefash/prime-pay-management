import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth/merchant')
export class MerchantAuthController {

    @UseGuards(AuthGuard('merchant-local'))
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }

}
