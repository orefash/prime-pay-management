import { Module } from '@nestjs/common';
import { MerchantsController } from './controllers/merchants/merchants.controller';
import { MerchantsService } from './services/merchants/merchants.service';

@Module({
  controllers: [MerchantsController],
  providers: [MerchantsService]
})
export class MerchantsModule {}
