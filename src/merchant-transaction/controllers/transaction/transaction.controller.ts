import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTransactionDto } from 'src/merchant-transaction/dto/CreateTransaction.dto';
import { TransactionService } from 'src/merchant-transaction/services/transaction/transaction.service';

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
            return await this.transactionService.createTransaction(createTransactionDto);
        } catch (error) {
            console.log('create transaction error')
            console.log(error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    @Get('')
    getAllTransactions() {
        return this.transactionService.getAllTransactions();
    }


    @Get('merchant/:mid')
    getMerchantTransactions(@Param('mid') mid: string) {
        return this.transactionService.getMerchantTransactions(mid);
    }

    @Get(':tid')
    getTransactionById(@Param('tid') tid: string) {
        return this.transactionService.getTransactionById(tid);
    }

}
