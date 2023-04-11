import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction/transaction.service';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/typeorm';
import { MerchantCustomerModule } from 'src/merchant-customer/merchant-customer.module';

@Module({
  imports: [
    MerchantCustomerModule,
    TypeOrmModule.forFeature([MerchantTransaction]),
  ],
  providers: [
  
    {
      provide: 'TRANSACTION_SERVICE',
      useClass: TransactionService,
    }
  ],
  controllers: [TransactionController]
})
export class MerchantTransactionModule {}
