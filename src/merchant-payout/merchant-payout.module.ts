import { Module } from '@nestjs/common';
import { MerchantPayoutService } from './services/merchant-payout/merchant-payout.service';
import { MerchantPayoutController } from './controllers/merchant-payout/merchant-payout.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantPayout } from 'src/typeorm';
import { ThirdPartyDataModule } from 'src/third-party-data/third-party-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantPayout, Merchant]),
    ThirdPartyDataModule,
  ],
  providers: [MerchantPayoutService],
  controllers: [MerchantPayoutController],
  exports: [MerchantPayoutService]
})
export class MerchantPayoutModule {}
