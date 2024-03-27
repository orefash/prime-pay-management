import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PayoutsService } from '../../services/payouts/payouts.service';
import JwtAuthenticationGuard from 'apps/agent-app/src/auth/utils/JWTAuthGuard';
import { CreatePayoutDto } from '../../../dto/CreatePayoutTransaction.dto';
import { WithdrawPayoutDto } from 'apps/agent-app/src/dto/WithdrawPayout.dto';

@Controller('payout')
export class PayoutsController {
    constructor(
        private readonly payoutService: PayoutsService
    ) { }

    @Get('')
    @UseGuards(JwtAuthenticationGuard)
    getPayoutData() {

        return this.payoutService.getPayoutList();
    }

    @Get('agent/:id')
    @UseGuards(JwtAuthenticationGuard)
    getPayoutDataByAgent(@Param('id') id: string) {

        return this.payoutService.getPayoutListByAgent(id);
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
    @UseGuards(JwtAuthenticationGuard)
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
