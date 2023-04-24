import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { CustomerService } from 'src/merchant-customer/services/customer/customer.service';

@Controller('customers')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService
    ){}

    @Get('')
    async getAllCustomers() {
        return await this.customerService.getAllCustomers();
    }

    @Get('/merchant/:mid')
    async getAllCustomersByMid(@Param('mid') mid: number) {
        try {
            const customers = await this.customerService.getAllCustomersByMid(mid);
            return customers;
        } catch (error) {
            
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
