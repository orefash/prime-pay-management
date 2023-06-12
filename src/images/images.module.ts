import { Module } from '@nestjs/common';
import { ImagesService } from './services/images/images.service';
import { ImagesController } from './controllers/images/images.controller';

@Module({
  providers: [ImagesService],
  controllers: [ImagesController]
})
export class ImagesModule {}
