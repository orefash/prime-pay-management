import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import JwtAuthenticationGuard from '../../../auth/utils/JWTAuthGuard';
import { CreatePayoutDto } from '../../dto/CreatePayoutTransaction.dto';
import { WithdrawPayoutDto } from '../../dto/WithdrawPayout.dto';
import { MerchantPayoutService } from '../../services/merchant-payout/merchant-payout.service';

@Controller('merchant-payout')
export class MerchantPayoutController {
    constructor(
        private readonly payoutService: MerchantPayoutService
    ) { }

    @Get('')
    @UseGuards(JwtAuthenticationGuard)
    getPayoutData() {

        return this.payoutService.getPayoutList();
    }

    @Get('merchant/:id')
    @UseGuards(JwtAuthenticationGuard)
    getPayoutDataByMerchant(@Param('mid') mid: number) {

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

    @Post('withdraw-balance/:mid')
    @UsePipes(ValidationPipe)
    async withdrawPayoutBalance(@Param('mid') mid: string, @Body() withdrawDto: WithdrawPayoutDto) {
        try {
            const transaction = await this.payoutService.withdrawFromBalance(mid, withdrawDto);
            return {
                status: HttpStatus.OK,
                data: transaction
            }
        } catch (error) {
            // console.log('create transaction error: ');
            // console.log(error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
