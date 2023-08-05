import { Controller, Get } from '@nestjs/common';
import { MailService } from 'src/mail/services/mail/mail.service';
import { Merchant } from 'src/typeorm';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) { }

    @Get('test')
    async testMail() {
        let merchant = new Merchant();
        merchant.name = 'Ore';
        await this.mailService.sendUserConfirmation(merchant, 'token');
    }


}
