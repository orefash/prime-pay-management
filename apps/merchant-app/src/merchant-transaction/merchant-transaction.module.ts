import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction/transaction.service';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from '../typeorm';
import { MerchantCustomerModule } from '../merchant-customer/merchant-customer.module';
import { ThirdPartyDataModule } from '../third-party-data/third-party-data.module';
import { MerchantPayoutModule } from '../merchant-payout/merchant-payout.module';

@Module({
  imports: [
    MerchantCustomerModule,
    TypeOrmModule.forFeature([MerchantTransaction]),
    ThirdPartyDataModule,
    MerchantPayoutModule
  ],
  providers: [
    {
      provide: 'TRANSACTION_SERVICE',
      useClass: TransactionService,
    }
  ],
  controllers: [TransactionController],
  // exports: [
  //   TransactionService
  // ],
})
export class MerchantTransactionModule {}
