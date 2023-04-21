import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant, ResetToken } from 'src/typeorm';
import { MerchantAuthController } from './controllers/merchant-auth/merchant-auth.controller';
import { MerchantAuthService } from './services/merchant-auth/merchant-auth.service';
import { JwtStrategy } from './utils/JWTStrategy';
// import { JwtStrategy } from './utils/JWTStrategy';
import { MerchantLocalStrategy } from './utils/MerchantLocalStrategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Merchant, ResetToken]),
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
    MerchantsModule
  ],
  providers: [
    {
      provide: 'MERCHANT_AUTH_SERVICE',
      useClass: MerchantAuthService
    },
    // {
    //   provide: 'MERCHANTS_SERVICE',
    //   useClass: MerchantsService
    // },
    // MerchantsService,
    MerchantLocalStrategy,
    JwtStrategy
  ],
  controllers: [MerchantAuthController]
})
export class AuthModule {}
