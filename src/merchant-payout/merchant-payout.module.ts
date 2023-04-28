import { Module } from '@nestjs/common';
import { MerchantPayoutService } from './services/merchant-payout/merchant-payout.service';
import { MerchantPayoutController } from './controllers/merchant-payout/merchant-payout.controller';

@Module({
  providers: [MerchantPayoutService],
  controllers: [MerchantPayoutController]
})
export class MerchantPayoutModule {}
