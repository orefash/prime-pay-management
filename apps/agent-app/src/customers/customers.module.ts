import { Module } from '@nestjs/common';
import { CustomersService } from './services/customers/customers.service';
import { CustomersController } from './controllers/customers/customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantCustomer, MerchantTransaction } from '../typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantTransaction, MerchantCustomer]),


  ],
  providers: [CustomersService],
  controllers: [CustomersController]
})
export class CustomersModule {}
