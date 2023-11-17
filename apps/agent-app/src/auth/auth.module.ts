import { Module } from '@nestjs/common';
import { AgentAuthController } from './controllers/agent-auth/agent-auth.controller';
import { AgentAuthService } from './services/agent-auth/agent-auth.service';
import { AgentsModule } from '../agents/agents.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agent, ResetToken } from '../typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './utils/LocalStrategy';
import { JwtStrategy } from './utils/JWTStrategy';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [

    PassportModule,
    BullModule.registerQueue({
      name: 'send_mail',
    }),
    TypeOrmModule.forFeature([Agent, ResetToken]),
    AgentsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
  ],
  controllers: [AgentAuthController],
  providers: [
    // AgentAuthService,
    {
      provide: 'AGENT_AUTH_SERVICE',
      useClass: AgentAuthService
    },
    // {
    //   provide: 'MERCHANTS_SERVICE',
    //   useClass: MerchantsService
    // },
    // MerchantsService,
    LocalStrategy,
    JwtStrategy
  ]
})
export class AuthModule { }
