import { Module } from '@nestjs/common';
import { StaticsService } from './services/statics/statics.service';
import { StaticsController } from './controllers/statics/statics.controller';

@Module({
  providers: [StaticsService],
  controllers: [StaticsController]
})
export class StaticsModule {}
