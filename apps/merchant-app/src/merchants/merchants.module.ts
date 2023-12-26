import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyDataModule } from '../third-party-data/third-party-data.module';
// import { JwtStrategy } from 'src/auth/utils/JWTStrategy';
import { Merchant } from '../typeorm';
import { MerchantsController } from './controllers/merchants/merchants.controller';
import { MerchantsService } from './services/merchants/merchants.service';
// import { CustomFileInterceptor } from 'src/interceptors/file-upload.interceptor';
import { MerchantMediaController } from './controllers/merchant-media/merchant-media.controller';
import { SuperAdminService } from './services/super-admin/super-admin.service';
import { SuperAdminController } from './controllers/super-admin/super-admin.controller';
import { WebService } from './services/web/web.service';
import { WebController } from './controllers/web/web.controller';
import { DigitalOceanModule } from '../digital-ocean/digital-ocean.module';

@Module({
  imports: [
    DigitalOceanModule,
    TypeOrmModule.forFeature([Merchant]),
    HttpModule,
    ThirdPartyDataModule,
    ConfigModule,
  ],
  exports: [MerchantsService],
  controllers: [MerchantsController, MerchantMediaController, SuperAdminController, WebController],
  providers: [
    MerchantsService,
    SuperAdminService,
    WebService,
    // CustomFileInterceptor
  ]

  
})
export class MerchantsModule {}
