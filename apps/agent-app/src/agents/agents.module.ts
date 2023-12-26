import { Module } from '@nestjs/common';
import { AgentsService } from './services/agents/agents.service';
import { AgentsController } from './controllers/agents/agents.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Agent } from '../typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ResetToken } from '../typeorm/ResetToken';
import { AdminService } from './services/admin/admin.service';
import { MediaService } from './services/media/media.service';
import { MediaController } from './controllers/media/media.controller';
import { AdminController } from './controllers/admin/admin.controller';
import { BullModule } from '@nestjs/bull';
import { MailModule } from '../mail/mail.module';
import { DigitalOceanModule } from '../digital-ocean/digital-ocean.module';

@Module({
  imports: [
    DigitalOceanModule,
    BullModule.registerQueue({
      name: 'send_mail',
    }),
    MailModule,
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
  providers: [AgentsService, AdminService, MediaService],
  exports: [AgentsService],
  controllers: [AgentsController, MediaController, AdminController]
})
export class AgentsModule {}
