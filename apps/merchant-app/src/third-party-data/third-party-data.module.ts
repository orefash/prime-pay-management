import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ThirdPartyDataService } from './services/third-party-data/third-party-data.service';
import { ThirdPartyDataController } from './controllers/third-party-data/third-party-data.controller';
import { PaystackService } from './services/paystack-service/paystack-service.service';

@Module({
  imports: [ HttpModule ],
  providers: [ThirdPartyDataService, PaystackService ],
  controllers: [ThirdPartyDataController],
  exports: [ThirdPartyDataService, PaystackService]
})
export class ThirdPartyDataModule {}
