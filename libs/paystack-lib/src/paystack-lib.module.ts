import { Module } from '@nestjs/common';
import { PaystackLibService } from './paystack-lib.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ HttpModule ],
  providers: [PaystackLibService],
  exports: [PaystackLibService],
})
export class PaystackLibModule {}
