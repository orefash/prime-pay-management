import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtStrategy } from 'src/auth/utils/JWTStrategy';
import { Merchant } from 'src/typeorm';
import { MerchantsController } from './controllers/merchants/merchants.controller';
import { MerchantsService } from './services/merchants/merchants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant]),
  
  ],
  // exports: [MerchantsService],
  controllers: [MerchantsController],
  providers: [
    {
      provide: 'MERCHANT_SERVICE',
      useClass: MerchantsService,
    },
    
  ]
})
export class MerchantsModule {}
