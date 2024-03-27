import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProcessor } from './processors/mailer.processor';
import { MailModule } from '../../mail/mail.module';

@Module({
    imports: [
      BullModule.registerQueue({
        name: 'send_mail',
      }),
      MailModule
    ],
    providers: [
        MailProcessor
    ],
    exports: [],
    controllers: [
        
    ]
  })
export class MailerModule {}
