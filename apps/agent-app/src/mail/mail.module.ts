import { Module } from '@nestjs/common';
import { MailService } from './services/mail/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './controllers/mail/mail.controller';

@Module({
  imports: [

    MailerModule.forRootAsync({

      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {

        console.log("in agent mailer config")
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
            from: `"Primepay" <${configService.get('MAILER_USER')}>`,
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
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
