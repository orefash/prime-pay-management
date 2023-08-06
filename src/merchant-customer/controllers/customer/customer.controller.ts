import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { CustomerService } from 'src/merchant-customer/services/customer/customer.service';
import { isValidDate } from 'src/utils/date-functions';

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ) { }

    // @Get('')
    // async getAllCustomers() {
    //     return await this.customerService.getAllCustomers();
    // }

    
    @Get('')
    // @UseGuards(JwtExpirationGuard)
    async getAllCustomers(@Query() queryParams: any) {
        return await this.customerService.getAllCustomers();
    }

    // @Get('/merchant/:mid')
    // @UseGuards(JwtAuthenticationGuard)
    // async getAllCustomersByMid(@Param('mid') mid: number) {
    //     try {
    //         const customers = await this.customerService.getAllCustomersByMid(mid);
    //         return customers;
    //     } catch (error) {

    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    @Get('/merchant/:mid')
    @UseGuards(JwtAuthenticationGuard)
    async getAllCustomersByMid(@Param('mid') mid: number, @Query() queryParams: any) {
        try {
            let isTest = null;
            let searchQuery = null;

            let pageNo: number = null;
            let itemLimit: number = null;

            if (queryParams.isTest) {
                isTest = queryParams.isTest;
            } else {
                throw new Error("Missing isTest value!!")
            }

            if (queryParams.search)
                searchQuery = queryParams.search;

            if (queryParams.page && !isNaN(Number(queryParams.page))) {
                console.log("page: ", queryParams.page)
                pageNo = Number(queryParams.page);
            }

            if (queryParams.limit && !isNaN(Number(queryParams.limit))) {
                console.log("limit: ", queryParams.limit)
                itemLimit = Number(queryParams.limit);
            }

            let startDate = null;
            let endDate = null;

            if (queryParams.startDate && isValidDate(queryParams.startDate))
                startDate = queryParams.startDate;

            if (queryParams.endDate && isValidDate(queryParams.endDate))
                endDate = queryParams.endDate;

                // console.log('st: ', startDate)
            const customers = await this.customerService.getAllCustomersByMid(mid, isTest, searchQuery, pageNo, itemLimit, startDate, endDate);
            return customers;
        } catch (error) {

            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}

