import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CustomerService } from './services/customer/customer.service';
import { CustomerController } from './controllers/customer/customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantCustomer, MerchantTransaction } from 'src/typeorm';
import { JwtExpirationMiddleware } from 'src/auth/utils/JWTExpirationGuard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantCustomer, MerchantTransaction]),
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
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService]
})
export class MerchantCustomerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtExpirationMiddleware).forRoutes('customers');
  }
}
