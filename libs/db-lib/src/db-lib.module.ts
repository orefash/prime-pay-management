import { Module } from '@nestjs/common';
import { DbLibService } from './db-lib.service';

@Module({
  providers: [DbLibService],
  exports: [DbLibService],
})
export class DbLibModule {}
