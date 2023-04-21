import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';
import { ThirdPartyDataModule } from 'src/third-party-data/third-party-data.module';
// import { JwtStrategy } from 'src/auth/utils/JWTStrategy';
import { Merchant } from 'src/typeorm';
import { MerchantsController } from './controllers/merchants/merchants.controller';
import { MerchantsService } from './services/merchants/merchants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant]),
    HttpModule,
    ThirdPartyDataModule
  ],
  exports: [MerchantsService],
  controllers: [MerchantsController],
  providers: [
    // {
    //   provide: 'MERCHANT_SERVICE',
    //   useClass: MerchantsService,
    // },
    // {
    //   provide: 'THIRD_PARTY_SERVICE',
    //   useClass: ThirdPartyDataService,
    // },
    // ThirdPartyDataService
    MerchantsService
  ]
})
export class MerchantsModule {}
