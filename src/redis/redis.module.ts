import { Module } from '@nestjs/common';
import { BaseService } from './services/base/base.service';

@Module({

  providers: [BaseService]
})
export class RedisModule {}

