import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Merchant } from 'src/typeorm';
import { ConfirmEmail } from 'src/mail/types/confirm_email.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: Merchant, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: 'orefaseru@gmail.com',
    //   to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Confirm your Email with Primepay',
      template: './confirmation', //
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
  

  async sendEmailConfirmation(userConfirm: ConfirmEmail) {
    const url = userConfirm.redirect_url;

    await this.mailerService.sendMail({
      to: userConfirm.email,
    //   to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Confirm your Email with Primepay',
      template: './confirmation', //
      context: { // ✏️ filling curly brackets with content
        name: userConfirm.name,
        url,
      },
    });
  }
}
