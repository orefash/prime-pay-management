import { Module } from '@nestjs/common';
import { MerchantKeyCreatorService } from './services/merchant-key-creator/merchant-key-creator.service';
import { MerchantKeyCreatorController } from './controller/merchant-key-creator/merchant-key-creator.controller';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { KeysModule } from 'src/keys/keys.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantKey } from 'src/typeorm';
import { ThirdPartyDataModule } from 'src/third-party-data/third-party-data.module';

@Module({
  imports: [
    MerchantsModule,
    KeysModule,
    ConfigModule,
    TypeOrmModule.forFeature([Merchant, MerchantKey]),
    ThirdPartyDataModule,
  ],
  providers: [
    MerchantKeyCreatorService
  ],
  controllers: [MerchantKeyCreatorController]
})
export class MerchantKeyCreatorModule {}
