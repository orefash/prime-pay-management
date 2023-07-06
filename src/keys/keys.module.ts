import { Module, forwardRef } from '@nestjs/common';
import { KeysService } from './services/keys/keys.service';
import { KeysController } from './controllers/keys/keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantKey } from 'src/typeorm';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Keys3partyController } from './controllers/keys-3party/keys-3party.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantKey, Merchant]),
  ],
  providers: [
    KeysService,
   
  ],
  controllers: [KeysController, Keys3partyController],
  exports: [KeysService]
})
export class KeysModule {}
