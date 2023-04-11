import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant } from 'src/typeorm';
import { MerchantAuthController } from './controllers/merchant-auth/merchant-auth.controller';
import { MerchantAuthService } from './services/merchant-auth/merchant-auth.service';
import { MerchantLocalStrategy } from './utils/MerchantLocalStrategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Merchant])
  ],
  providers: [
    {
      provide: 'MERCHANT_AUTH_SERVICE',
      useClass: MerchantAuthService
    },
    {
      provide: 'MERCHANTS_SERVICE',
      useClass: MerchantsService
    },
    MerchantLocalStrategy
  ],
  controllers: [MerchantAuthController]
})
export class AuthModule {}
