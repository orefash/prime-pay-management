import { ConfirmEmail } from '@app/db-lib/types/confirm_email.type';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Agent } from '../../../typeorm';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(user: Agent, token: string) {
        const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: 'orefaseru@gmail.com',
            //   to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Confirm your Email with Primepay',
            template: './confirmation', //
            context: { // ✏️ filling curly brackets with content
                name: user.agentFname + " " + user.agentLname,
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


    async sendResetPasswordEmail(userConfirm: ConfirmEmail) {
        const url = userConfirm.redirect_url;

        await this.mailerService.sendMail({
            to: userConfirm.email,
            //   to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Reset your Password',
            template: './reset-password', //
            context: { // ✏️ filling curly brackets with content
                name: userConfirm.name,
                url,
            },
        });
    }
}
