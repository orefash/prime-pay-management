import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import JwtAuthenticationGuard from '../../../auth/utils/JWTAuthGuard';
import { CreateTransactionDto } from 'src/merchant-transaction/dto/CreateTransaction.dto';
import { TransactionService } from 'src/merchant-transaction/services/transaction/transaction.service';
import RequestWithMerchant from 'src/auth/types/requestWithMerchant.interface';

@Controller('transactions')
export class TransactionController {

    constructor(
        @Inject('TRANSACTION_SERVICE')
        private readonly transactionService: TransactionService
    ){}

    @Post('create')
    @UsePipes(ValidationPipe)
    async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            const transaction = await this.transactionService.createTransaction(createTransactionDto);
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

    @Post('create-demo')
    @UsePipes(ValidationPipe)
    async createDemoTransaction(@Body() createTransactionDto: CreateTransactionDto) {
        try {
            return await this.transactionService.createDemoTransaction(createTransactionDto);
        } catch (error) {
            console.log('create transaction error')
            console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Post(':id/toggle-delivered')
    @UseGuards(JwtAuthenticationGuard)
    async toggleTransactionDelivered(@Param('id') id: string) {
        try {
            return await this.transactionService.toggleTransactionDelivered(id);
        } catch (error) {
            console.log('toggle transaction error')
            console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Post(':id/toggle-confirmed')
    @UseGuards(JwtAuthenticationGuard)
    async toggleTransactionConfirmed(@Param('id') id: string) {
        try {
            return await this.transactionService.toggleTransactionConfirmed(id);
        } catch (error) {
            console.log('toggle transaction error')
            console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Get('')
    @UseGuards(JwtAuthenticationGuard)
    getAllTransactions(@Req() request: RequestWithMerchant) {

        return this.transactionService.getAllTransactions();
    }


    @Get('merchant/:mid')
    @UseGuards(JwtAuthenticationGuard)
    getMerchantTransactions(@Param('mid') mid: number) {
        return this.transactionService.getMerchantTransactions(mid);
    }

    @Get(':tid')
    @UseGuards(JwtAuthenticationGuard)
    getTransactionById(@Param('tid') tid: string) {
        return this.transactionService.getTransactionById(tid);
    }

}
