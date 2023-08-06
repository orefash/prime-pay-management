import { Module } from '@nestjs/common';
import { MerchantKeyCreatorService } from './services/merchant-key-creator/merchant-key-creator.service';
import { MerchantKeyCreatorController } from './controller/merchant-key-creator/merchant-key-creator.controller';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { KeysModule } from 'src/keys/keys.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantKey, ResetToken } from 'src/typeorm';
import { ThirdPartyDataModule } from 'src/third-party-data/third-party-data.module';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from 'src/mailer-modules/mailer/processors/mailer.processor';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send_mail',
    }),
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
