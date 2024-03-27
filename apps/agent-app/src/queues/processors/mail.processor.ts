import { Process, Processor } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import { MailService } from "../../mail/services/mail/mail.service";
import { Agent } from "../../typeorm";
import { Job } from "bull";
import { ConfirmEmail } from "@app/db-lib/types/confirm_email.type";


@Processor('send_mail')
export class MailProcessor {

    constructor(
        @Inject(MailService) 
        private readonly mailService: MailService,

    ){}

    @Process('test_mail')
    async handleMailerTest(){

        console.log("in mail handler");
        let agent = new Agent();
        agent.agentFname = 'Ore';
        await this.mailService.sendUserConfirmation(agent, 'token');

        return "done it "
    }

    @Process('confirm_mail')
    async confirmEmailHandler(job: Job<any>){

        const data: ConfirmEmail = job.data;

        await this.mailService.sendEmailConfirmation(data);

        return "done send cconfirm"
    }

    @Process('reset_password')
    async resetPasswordHandler(job: Job<any>){

        console.log("in reset handler")

        const data: ConfirmEmail = job.data;

        await this.mailService.sendResetPasswordEmail(data);

        return "done reset-password"
    }

}