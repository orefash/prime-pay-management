import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { CustomerService } from 'src/merchant-customer/services/customer/customer.service';

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ){}

    // @Get('')
    // async getAllCustomers() {
    //     return await this.customerService.getAllCustomers();
    // }

    @Get('')
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

            if(queryParams.isTest){
               isTest = queryParams.isTest;
            }else{
                throw new Error("Missing isTest value!!")
            }

            if(queryParams.search)
                searchQuery = queryParams.search;


            const customers = await this.customerService.getAllCustomersByMid(mid, isTest, searchQuery);
            return customers;
        } catch (error) {
            
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
