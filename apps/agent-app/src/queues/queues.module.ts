import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { MailProcessor } from './processors/mail.processor';

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
})
export class QueuesModule {

}
