import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ThirdPartyDataService } from './services/third-party-data/third-party-data.service';
import { ThirdPartyDataController } from './controllers/third-party-data/third-party-data.controller';

@Module({
  imports: [ HttpModule ],
  providers: [ThirdPartyDataService],
  controllers: [ThirdPartyDataController],
  exports: [ThirdPartyDataService]
})
export class ThirdPartyDataModule {}
