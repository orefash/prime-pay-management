import { Module, forwardRef } from '@nestjs/common';
import { KeysService } from './services/keys/keys.service';
import { KeysController } from './controllers/keys/keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantKey } from 'src/typeorm';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantKey]),
  ],
  providers: [
    KeysService,
   
  ],
  controllers: [KeysController],
  exports: [KeysService]
})
export class KeysModule {}
