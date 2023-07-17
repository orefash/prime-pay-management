import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import JwtAuthenticationGuard from '../../../auth/utils/JWTAuthGuard';
import { CreateTransactionDto } from 'src/merchant-transaction/dto/CreateTransaction.dto';
import { TransactionService } from 'src/merchant-transaction/services/transaction/transaction.service';
import RequestWithMerchant from 'src/auth/types/requestWithMerchant.interface';
import { mTransaction } from 'src/types/mTransaction.interface';

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

    // @Get('')
    // @UseGuards(JwtAuthenticationGuard)
    // getAllTransactions(@Req() request: RequestWithMerchant) {

    //     return this.transactionService.getAllTransactions();
    // }

    @Get('')
    @UseGuards(JwtAuthenticationGuard)
    async getAllTransactions(@Req() request: RequestWithMerchant, @Query() queryParams: any) {

        let whereConditions = {};
        let searchQuery = null;

        if(queryParams.orderChannel){
            whereConditions['orderChannel'] = queryParams.orderChannel;
        }

        if(queryParams.isTest){
            whereConditions['isTest'] = queryParams.isTest;
        }

        if(queryParams.search){
            searchQuery = queryParams.search;
        }

        if(queryParams.status){
            whereConditions['status'] = queryParams.status;
        }

        console.log('sc: ', searchQuery)
        console.log('wc: ', whereConditions)

        try {
            return await this.transactionService.findEntities(whereConditions, searchQuery);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        
    }


    // @Get('merchant/:mid')
    // @UseGuards(JwtAuthenticationGuard)
    // getMerchantTransactions(@Param('mid') mid: number) {
    //     return this.transactionService.getMerchantTransactions(mid);
    // }


    @Get('merchant/:mid')
    @UseGuards(JwtAuthenticationGuard)
    async getMerchantTransactions(@Param('mid') mid: number, @Query() queryParams: any) {


        let whereConditions = {
            mid: mid
        };

        let searchQuery = null;

        if(queryParams.orderChannel){
            whereConditions['orderChannel'] = queryParams.orderChannel;
        }

        if(queryParams.isTest){
            whereConditions['isTest'] = queryParams.isTest;
        }

        if(queryParams.search){
            searchQuery = queryParams.search;
        }

        if(queryParams.status){
            whereConditions['status'] = queryParams.status;
        }

        console.log('sc: ', searchQuery)
        console.log('wc: ', whereConditions)
        
        try {
            return await this.transactionService.findEntities(whereConditions, searchQuery);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':tid')
    @UseGuards(JwtAuthenticationGuard)
    getTransactionById(@Param('tid') tid: string) {
        return this.transactionService.getTransactionById(tid);
    }

}
