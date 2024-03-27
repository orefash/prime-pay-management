import { Controller, Get } from '@nestjs/common';
import { MailService } from '../../services/mail/mail.service';
import { Agent } from '../../../typeorm';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService
    ) { }

    @Get('test')
    async testMail() {
        let merchant = new Agent();
        merchant.agentFname = 'Ore';
        merchant.agentLname = 'Fash';
        await this.mailService.sendUserConfirmation(merchant, 'token');
    }


}
