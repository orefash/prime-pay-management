import { Module } from '@nestjs/common';
import { SpacesService } from './services/spaces/spaces.service';

@Module({
  providers: [SpacesService],
  exports: [SpacesService]
})
export class DigitalOceanModule {}
