import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { CreatePayoutDto } from 'src/merchant-payout/dto/CreatePayoutTransaction.dto';
import { MerchantPayoutService } from 'src/merchant-payout/services/merchant-payout/merchant-payout.service';

@Controller('merchant-payout')
export class MerchantPayoutController {
    constructor(
        private readonly payoutService: MerchantPayoutService
    ){}

    @Get('')
    // @UseGuards(JwtAuthenticationGuard)
    getPayoutData() {

        return this.payoutService.getPayoutList();
    }

    @Get('merchant/:id')
    // @UseGuards(JwtAuthenticationGuard)
    getPayoutDataByMerchant(@Param('mid') mid: string) {

        return this.payoutService.getPayoutListByMerchant(mid);
    }

    @Post('create')
    @UsePipes(ValidationPipe)
    async createPayoutTransaction(@Body() createpayoutDto: CreatePayoutDto) {
        try {
            const transaction = await this.payoutService.addTransactionToList(createpayoutDto);
            return {
                status: HttpStatus.OK,
                data: transaction
            }
        } catch (error) {
            console.log('create transaction error')
            console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

}
