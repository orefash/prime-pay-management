import { Controller, Get, HttpException, HttpStatus, Param, Query, Req } from '@nestjs/common';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { isValidDate } from '@app/utils/utils/date-functions';

@Controller('transactions')
export class TransactionsController {
    constructor(
        private readonly transactionService: TransactionsService
    ) { }


    @Get('agent/:agentCode')
    async getAllTransactions(@Param('agentCode') agentCode: string, @Query() queryParams: any) {

        let whereConditions = {};
        let searchQuery: string = null;
        let pageNo: number = null;
        let itemLimit: number = null;

        if (queryParams.orderChannel) {
            whereConditions['orderChannel'] = queryParams.orderChannel;
        }

        if (queryParams.isTest) {
            whereConditions['isTest'] = false;
        }

        if (queryParams.search) {
            searchQuery = queryParams.search;
        }

        if (queryParams.status) {
            whereConditions['status'] = queryParams.status;
        }

        if (queryParams.page && !isNaN(Number(queryParams.page))) {
            // console.log("page: ", queryParams.page)
            pageNo = Number(queryParams.page);
        }

        if (queryParams.limit && !isNaN(Number(queryParams.limit))) {
            // console.log("limit: ", queryParams.limit)
            itemLimit = Number(queryParams.limit);
        }

        let startDate = null;
        let endDate = null;

        if (queryParams.startDate && isValidDate(queryParams.startDate))
            startDate = queryParams.startDate;

        if (queryParams.endDate && isValidDate(queryParams.endDate))
            endDate = queryParams.endDate;

        console.log('st: ', startDate)

        try {
            const transactions = await this.transactionService.findEntities(agentCode, whereConditions, searchQuery, pageNo, itemLimit, startDate, endDate);
            return { success: true, ...transactions}
        } catch (error) {
            console.log("Error: ", error)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get(':id')
    async getTransaction(@Param('id') id: string) {
        try {
            return await this.transactionService.getTransactionById(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
