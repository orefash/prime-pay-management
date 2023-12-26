import { Controller, Get } from '@nestjs/common';
import { WebService } from '../../services/web/web.service';

@Controller('merchants/web')
export class WebController {
    constructor(
        private readonly webServcie: WebService,
        // private readonly configService: ConfigService,

    ) {

    }

    @Get('logos')
    getAllMerchants() {
        return this.webServcie.getAllMerchantsLogo(

        );
    }
}
