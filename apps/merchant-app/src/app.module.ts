import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import type { RedisClientOptions } from 'redis';
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
// import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
// import { redisStore } from 'cache-manager-redis-yet';

import * as redisStore from 'cache-manager-ioredis';
import { AuthLibModule } from '@app/auth';

// import * as redisStore from 'cache-manager-redis-store';

// import { CacheModule, CacheService } from '@nestjs/common'; // Import CacheModule and CacheService


// import { CacheModule as CacheModule_ } from "@nestjs/cache-manager";
import { DigitalOceanModule } from './digital-ocean/digital-ocean.module';



@Module({
  imports: [

    // AuthLibModule,
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
      // url: 'redis://prime456@prime-redis-app.bots.prime-pay.africa:6379',
      // no_ready_check: true,
    }),


    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME'),
          // host: parseInt(configService.get('IS_LOCAL')) === 0 ? ,
          // port: 5005

        },
      }),
      inject: [ConfigService]
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
    DigitalOceanModule,

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
      .exclude('api/merchants/upload')
      .forRoutes(MerchantsController, TransactionController, CustomerController, KeysController, MerchantPayoutController, MerchantProductController, OverviewController);
  }
}
