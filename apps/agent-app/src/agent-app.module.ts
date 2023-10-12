import { Module } from '@nestjs/common';
import { AgentAppController } from './agent-app.controller';
import { AgentAppService } from './agent-app.service';
import { AgentsModule } from './agents/agents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigService } from './config/TypeOrmConfig';
import { AuthModule } from './auth/auth.module';
import { OverviewModule } from './overview/overview.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    AgentsModule,
    AuthModule,
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    OverviewModule,
  ],
  controllers: [AgentAppController],
  providers: [AgentAppService],
})
export class AgentAppModule {}
