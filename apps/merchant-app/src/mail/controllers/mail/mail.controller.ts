import { Controller, Get } from '@nestjs/common';
import { MailService } from '../../services/mail/mail.service';
import { Merchant } from '../../../typeorm';

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
