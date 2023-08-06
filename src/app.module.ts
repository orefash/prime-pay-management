import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized.exception';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JwtExpirationMiddleware } from './auth/utils/JWTExpirationGuard';
import { TransactionController } from './merchant-transaction/controllers/transaction/transaction.controller';
import { MerchantsController } from './merchants/controllers/merchants/merchants.controller';
import { CustomerController } from './merchant-customer/controllers/customer/customer.controller';
import { KeysController } from './keys/controllers/keys/keys.controller';
import { MerchantPayoutController } from './merchant-payout/controllers/merchant-payout/merchant-payout.controller';
import { MerchantProductController } from './merchant-product/controllers/merchant-product/merchant-product.controller';
import { OverviewController } from './overview/controllers/overview/overview.controller';
// import { MailerModule } from './mailer/mailer.module';
import { MailModule } from './mail/mail.module';
import { BullModule } from '@nestjs/bull';
import { MailerController } from './mailer-modules/contollers/mailer/mailer.controller';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {

        const isProduction = configService.get<number>('IS_LOCAL') === 0;
  
        const redisConfig: any = {
          host: configService.get<string>('REDIS_HOST'),
          port: Number(configService.get<number>('REDIS_PORT')),
        };

        if (isProduction) {
          // Add the 'password' property to the Redis configuration only in production
          redisConfig.redis.password = configService.get<string>('REDIS_PASSWORD');
        }

        return {
          redis: redisConfig,
        };
      },
      inject: [ConfigService],
    }),

    MerchantsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
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
    // MailerModule,
    MailModule,
 
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
  ],
  controllers: [MailerController],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtExpirationMiddleware)
    // .exclude('api/merchants/:merchantId/logo')
    .forRoutes(TransactionController, MerchantsController, CustomerController, KeysController, MerchantPayoutController, MerchantProductController, OverviewController);
  }
}
