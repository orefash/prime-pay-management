import { Module } from '@nestjs/common';
import { MerchantProductService } from './services/merchant-product/merchant-product.service';
import { MerchantProductController } from './controllers/merchant-product/merchant-product.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantProduct } from '../typeorm';
import { DigitalOceanModule } from '../digital-ocean/digital-ocean.module';

@Module({
  imports:[

    DigitalOceanModule,
    ConfigModule,
    TypeOrmModule.forFeature([Merchant, MerchantProduct]),
  ],
  providers: [MerchantProductService],
  controllers: [MerchantProductController]
})
export class MerchantProductModule {}
