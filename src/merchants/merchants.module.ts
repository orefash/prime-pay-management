import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from 'src/typeorm';
import { MerchantsController } from './controllers/merchants/merchants.controller';
import { MerchantsService } from './services/merchants/merchants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant])
  ],
  controllers: [MerchantsController],
  providers: [
    {
      provide: 'MERCHANT_SERVICE',
      useClass: MerchantsService,
    }
  ]
})
export class MerchantsModule {}
