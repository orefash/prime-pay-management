import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './controllers/mail/mail.controller';

@Module({
  imports: [

    MailerModule.forRoot({
      transport: {
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'ofaseru@prime-pay.africa',
          pass: '1234567890',
        },
      },
      defaults: {
        from: '"Primepay" <ofaseru@prime-pay.africa>',
      },
      
      template: {
        // dir: `${process.cwd()}/templates`,
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),

  ],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
