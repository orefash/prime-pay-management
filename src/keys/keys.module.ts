import { Module } from '@nestjs/common';
import { KeysService } from './services/keys/keys.service';
import { KeysController } from './controllers/keys/keys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantKey } from 'src/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantKey]),
  ],
  providers: [KeysService],
  controllers: [KeysController]
})
export class KeysModule {}
