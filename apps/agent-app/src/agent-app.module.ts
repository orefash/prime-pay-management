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
import { BullModule } from '@nestjs/bull';
import { QueuesModule } from './queues/queues.module';
import { PayoutsModule } from './payouts/payouts.module';
import { ExternalApisModule } from './external-apis/external-apis.module';

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
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
          password: configService.get('REDIS_PASSWORD'),
          username: configService.get('REDIS_USERNAME'),
          // host: parseInt(configService.get('IS_LOCAL')) === 0 ? ,
          // port: 5005

        },
      }),
      inject: [ConfigService]
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
    QueuesModule,
    PayoutsModule,
    ExternalApisModule,
  ],
  controllers: [AgentAppController],
  providers: [AgentAppService],
})
export class AgentAppModule { }
