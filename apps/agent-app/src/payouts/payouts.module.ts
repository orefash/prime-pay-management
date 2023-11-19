import { Module } from '@nestjs/common';
import { PayoutsService } from './services/payouts/payouts.service';
import { PayoutsController } from './controllers/payouts/payouts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent, AgentPayout } from '../typeorm';
import { PaystackLibModule } from '@app/paystack-lib';
import { ExternalApisModule } from '../external-apis/external-apis.module';


@Module({
  imports: [

    ExternalApisModule,
    TypeOrmModule.forFeature([AgentPayout, Agent]),
  ],
  providers: [PayoutsService],
  controllers: [PayoutsController]
})
export class PayoutsModule {}
