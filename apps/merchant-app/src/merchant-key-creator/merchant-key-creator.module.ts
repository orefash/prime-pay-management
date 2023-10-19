import { Module } from '@nestjs/common';
import { MerchantKeyCreatorService } from './services/merchant-key-creator/merchant-key-creator.service';
import { MerchantKeyCreatorController } from './controller/merchant-key-creator/merchant-key-creator.controller';
import { MerchantsModule } from '../merchants/merchants.module';
import { KeysModule } from '../keys/keys.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantKey, ResetToken } from '../typeorm';
import { ThirdPartyDataModule } from '../third-party-data/third-party-data.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from '../mailer-modules/mailer/processors/mailer.processor';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send_mail',
    }),
    // CacheModule,
    MailModule,
    MerchantsModule,
    KeysModule,
    ConfigModule,
    TypeOrmModule.forFeature([Merchant, MerchantKey, ResetToken]),
    ThirdPartyDataModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `3600s`,
        },
      }),
    }),
  ],
  providers: [
    MerchantKeyCreatorService,
    MailProcessor
  ],
  controllers: [MerchantKeyCreatorController]
})
export class MerchantKeyCreatorModule {}
