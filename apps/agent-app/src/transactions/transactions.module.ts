import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions/transactions.service';
import { TransactionsController } from './controllers/transactions/transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantTransaction } from '../typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantTransaction, Merchant]),

],
  providers: [TransactionsService],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
