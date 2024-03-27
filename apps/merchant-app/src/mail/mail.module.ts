import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailController } from './controllers/mail/mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [

    MailerModule.forRootAsync({

      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {

        console.log("in mailer config")
        const isLocal: string = configService.get('IS_LOCAL_STORAGE');
        console.log("isLocal: ", isLocal);
        const isProd: boolean = isLocal === 'false' ? true : false;

        const templateDir: string = isProd ? 'mail/templates' : 'mail/templates';

        console.log("mail template Path: ", templateDir)

        return {
          transport: {
            host: configService.get('MAILER_HOST'),
            port: parseInt(configService.get('MAILER_PORT')),
            secure: true,
            auth: {
              user: configService.get('MAILER_USER'),
              pass: configService.get('MAILER_PASS'),
            },
          },
          defaults: {
            from: '"Primepay" <info@prime-pay.africa>',
          },

          template: {
            // dir: `${process.cwd()}/templates`,
            dir: join(__dirname, templateDir),
            adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
            options: {
              strict: true,
            },
          },
        }
      },
      inject: [ConfigService],
    }),

    // MailerModule.forRoot({
    //   transport: {
    //     host: 'mail.privateemail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: 'ofaseru@prime-pay.africa',
    //       pass: '1234567890',
    //     },
    //   },
    //   defaults: {
    //     from: '"Primepay" <ofaseru@prime-pay.africa>',
    //   },

    //   template: {
    //     // dir: `${process.cwd()}/templates`,
    //     dir: join(__dirname, '..', 'templates'),
    //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),

  ],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule { }
