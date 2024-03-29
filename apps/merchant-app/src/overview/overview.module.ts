import { Module } from '@nestjs/common';
import { OverviewService } from './services/overview/overview.service';
import { OverviewController } from './controllers/overview/overview.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantCustomer, MerchantTransaction } from '../typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantTransaction, MerchantCustomer, Merchant]),
  
  ],
  providers: [OverviewService],
  controllers: [OverviewController]
})
export class OverviewModule {}
