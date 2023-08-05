import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Merchant } from 'src/typeorm';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: Merchant, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    
    await this.mailerService.sendMail({
      to: 'orefaseru@gmail.com',
    //   to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', //
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        url,
      },
    });
  }
}
