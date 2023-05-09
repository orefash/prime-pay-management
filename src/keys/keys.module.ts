import { Module } from '@nestjs/common';
import { KeysService } from './services/keys/keys.service';
import { KeysController } from './controllers/keys/keys.controller';

@Module({
  providers: [KeysService],
  controllers: [KeysController]
})
export class KeysModule {}
