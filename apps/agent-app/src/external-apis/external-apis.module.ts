import { Module } from '@nestjs/common';
import { PaystackService } from './services/paystack/paystack.service';
import { PrimepayService } from './services/primepay/primepay.service';
import { PaystackController } from './controllers/paystack/paystack.controller';
import { PrimepayController } from './controllers/primepay/primepay.controller';
import { HttpModule } from '@nestjs/axios';

@Module({

  imports: [HttpModule],
  providers: [PaystackService, PrimepayService],
  controllers: [PaystackController, PrimepayController],
  exports: [PaystackService, PrimepayService]
})
export class ExternalApisModule { }
