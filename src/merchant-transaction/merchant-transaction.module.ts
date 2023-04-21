import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction/transaction.service';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantTransaction } from 'src/typeorm';
import { MerchantCustomerModule } from 'src/merchant-customer/merchant-customer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThirdPartyDataModule } from 'src/third-party-data/third-party-data.module';

@Module({
  imports: [
    MerchantCustomerModule,
    TypeOrmModule.forFeature([MerchantTransaction]),
    ThirdPartyDataModule
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
