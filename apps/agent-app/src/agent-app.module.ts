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
import { CustomersModule } from './customers/customers.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    AgentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
      // url: 'redis://prime456@prime-redis-app.bots.prime-pay.africa:6379',
      // no_ready_check: true,
    }),
    AuthModule,
    TransactionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    OverviewModule,
    CustomersModule,
  ],
  controllers: [AgentAppController],
  providers: [AgentAppService],
})
export class AgentAppModule { }
