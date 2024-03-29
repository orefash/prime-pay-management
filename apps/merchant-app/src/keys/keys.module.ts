import { Module, forwardRef } from '@nestjs/common';
import { KeysService } from './services/keys/keys.service';
import { KeysController } from './controllers/keys/keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant, MerchantKey } from '../typeorm';
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
