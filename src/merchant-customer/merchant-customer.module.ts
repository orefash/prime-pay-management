import { Module } from '@nestjs/common';
import { CustomerService } from './services/customer/customer.service';
import { CustomerController } from './controllers/customer/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantCustomer, MerchantTransaction } from 'src/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantCustomer, MerchantTransaction])
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService]
})
export class MerchantCustomerModule {}
