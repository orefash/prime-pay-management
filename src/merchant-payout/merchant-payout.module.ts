import { Module } from '@nestjs/common';
import { MerchantPayoutService } from './services/merchant-payout/merchant-payout.service';
import { MerchantPayoutController } from './controllers/merchant-payout/merchant-payout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantPayout } from 'src/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantPayout, Merchant]),
  ],
  providers: [MerchantPayoutService],
  controllers: [MerchantPayoutController]
})
export class MerchantPayoutModule {}
