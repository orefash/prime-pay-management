import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MerchantsModule } from './merchants/merchants.module';

@Module({
  imports: [MerchantsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
