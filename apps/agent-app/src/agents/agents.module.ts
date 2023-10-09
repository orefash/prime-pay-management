import { Module } from '@nestjs/common';
import { AgentsService } from './services/agents/agents.service';
import { AgentsController } from './controllers/agents/agents.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Agent } from '../typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ResetToken } from '../typeorm/ResetToken';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent]),
    HttpModule,
    // ThirdPartyDataModule,
    ConfigModule,
    AgentsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `3600s`,
        },
      }),
    }),

    TypeOrmModule.forFeature([Agent, ResetToken]),
  ],
  providers: [AgentsService],
  exports: [AgentsService],
  controllers: [AgentsController]
})
export class AgentsModule {}
