import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { MerchantsModule } from './merchants/merchants.module';
import { AuthModule } from './auth/auth.module';
import { MerchantTransactionModule } from './merchant-transaction/merchant-transaction.module';
import { MerchantCustomerModule } from './merchant-customer/merchant-customer.module';
import { TypeOrmConfigService } from './config/TypeOrmConfig';
import { ThirdPartyDataModule } from './third-party-data/third-party-data.module';
import { StaticsModule } from './statics/statics.module';
import { OverviewModule } from './overview/overview.module';
import { MerchantPayoutModule } from './merchant-payout/merchant-payout.module';
import { KeysModule } from './keys/keys.module';
import { MerchantKeyCreatorModule } from './merchant-key-creator/merchant-key-creator.module';
import { MerchantProductModule } from './merchant-product/merchant-product.module';
import { ImagesModule } from './images/images.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MerchantsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    AuthModule,
    MerchantTransactionModule,
    MerchantCustomerModule,
    ThirdPartyDataModule,
    StaticsModule,
    OverviewModule,
    MerchantPayoutModule,
    KeysModule,
    MerchantKeyCreatorModule,
    MerchantProductModule,
    ImagesModule,
 
  ],
})
export class AppModule {}
