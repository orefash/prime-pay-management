import { Controller, Get, HttpException, HttpStatus, Param, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';

@Controller('merchants')
export class MerchantMediaController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,

    ) {

    }

    @Get(':merchantId/logo')
    async getMerchantLogo(@Param('merchantId') merchantId: string, @Res() res: Response) {
        let fileData = await this.merchantService.getMerchantLogo(merchantId);

        // console.log('fileData: ', fileData);

        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }

    @Get(':merchantId/id-card/mm/:mime1/:mime2/:name')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantIdentification(@Param('merchantId') merchantId: string, @Res() res: Response) {

        let fileData = await this.merchantService.getMerchantIdentification(merchantId);
        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }

    @Get(':merchantId/cac')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantCACDocs(@Param('merchantId') merchantId: string, @Req() req) {

        try {
            const baseUrl = `${req.protocol}://${req.headers.host}/api/merchants`;

            let cacData = await this.merchantService.getMerchantCACDocs(merchantId, baseUrl);

            return cacData;
        } catch (error) {
            console.log("error: ", error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        }
    }

    @Get('cac/:merchantId/mm/:mimeType1/:mimetype2/doc/:name')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantCACDocument(@Param('merchantId') merchantId: string, @Param('mimeType1') mimetype1: string, @Param('mimetype2') mimetype2: string, @Param('name') filename: string, @Req() req, @Res() res: Response) {

        // console.log("in cac dco fetch");
        try {
            let mimeType = `${mimetype1}/${mimetype2}`;

            // console.log('mm: ', mimeType)

            let cacData = await this.merchantService.getMerchantCACDocument(merchantId, filename, mimeType);

            // console.log('cacdata: ', cacData)

            res.attachment(cacData.fileName);
            res.setHeader('Content-Type', cacData.contentType);

            // Send the file
            res.sendFile(cacData.filePath);
        } catch (error) {
            console.log("error: ", error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        }
    }


    // @Get(':merchantId/cac')
    // // @UseGuards(JwtAuthenticationGuard)
    // async getMerchantCAC(@Param('merchantId') merchantId: string, @Res() res: Response, @Req() req) {

    //     const baseUrl = `${req.protocol}://${req.headers.host}/api/merchant`;

    //     let fileData = await this.merchantService.getMerchantCACDocs(merchantId, baseUrl);
    //     res.attachment(fileData.fileName);
    //     res.setHeader('Content-Type', fileData.contentType);

    //     // Send the file
    //     res.sendFile(fileData.filePath);
    // }

}
