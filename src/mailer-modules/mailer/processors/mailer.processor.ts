import { Process, Processor } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import { Job } from "bull";
import { MailService } from "src/mail/services/mail/mail.service";
import { ConfirmEmail } from "src/mail/types/confirm_email.type";
import { Merchant } from "src/typeorm";


@Processor('send_mail')
export class MailProcessor {

    constructor(
        @Inject(MailService) 
        private readonly mailService: MailService,

    ){}

    @Process('test_mail')
    async handleMailerTest(){

        let merchant = new Merchant();
        merchant.name = 'Ore';
        await this.mailService.sendUserConfirmation(merchant, 'token');

        return "done it "
    }

    @Process('confirm_mail')
    async confirmEmailHandler(job: Job<any>){

        const data: ConfirmEmail = job.data;
        
        await this.mailService.sendEmailConfirmation(data);

        return "done it "
    }

}