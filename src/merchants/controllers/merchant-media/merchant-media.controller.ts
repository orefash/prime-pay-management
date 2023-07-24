import { Controller, Get, Param, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';

@Controller('merchant')
export class MerchantMediaController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,

    ) {

    }

    @Get(':merchantId/logo')
    async getMerchantLogo(@Param('merchantId') merchantId: string, @Res() res: Response) {
        let fileData = await this.merchantService.getMerchantLogo(merchantId);
        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }

}
