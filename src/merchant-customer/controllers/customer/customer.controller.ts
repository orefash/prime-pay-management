import { Controller, Get } from '@nestjs/common';
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
}
