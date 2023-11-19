import { Module } from '@nestjs/common';
import { PayoutsService } from './services/payouts/payouts.service';
import { PayoutsController } from './controllers/payouts/payouts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent, AgentPayout } from '../typeorm';

@Module({
  imports: [

    TypeOrmModule.forFeature([AgentPayout, Agent]),
  ],
  providers: [PayoutsService],
  controllers: [PayoutsController]
})
export class PayoutsModule {}
