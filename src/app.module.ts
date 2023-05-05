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
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


const multerOptions: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads',
    
  }),
};

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
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  ],
})
export class AppModule {}
