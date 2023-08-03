import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer/mailer.service';
import { MailerController } from './controllers/mailer/mailer.controller';

@Module({
  providers: [MailerService],
  controllers: [MailerController]
})
export class MailerModule {}
