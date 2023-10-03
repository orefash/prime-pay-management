import { Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';

import * as fs from 'fs';

@Controller('merchants')
export class MerchantMediaController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,

    ) {

    }

    @Get(':merchantId/logo')
    async getMerchantLogo(
        @Param('merchantId') merchantId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.merchantService.getMerchantLogo(merchantId);

            if (!fileData) {
                throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
            }

            res.attachment(fileData.fileName);
            res.setHeader('Content-Type', fileData.contentType);

            res.sendFile(fileData.filePath);
        } catch (error) {
            console.error('Error in getMerchantLogo:', error);
            res.status(error.getStatus()).json({ message: error.message });
            // } else {
            //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            //         message: 'Internal server error',
            //     });
            // }
        }
    }

    @Get(':merchantId/id-card/mm/:mime1/:mime2/:name')
    async getMerchantIdentification(
        @Param('merchantId') merchantId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.merchantService.getMerchantIdentification(
                merchantId,
            );

            if (!fileData) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            }

            res.attachment(fileData.fileName);
            res.setHeader('Content-Type', fileData.contentType);

            res.sendFile(fileData.filePath);
        } catch (error) {
            console.error('Error in getMerchantIdentification:', error);
            if (error instanceof HttpException) {
                res.status(error.getStatus()).json({ message: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error',
                });
            }
        }
    }

    @Get(':merchantId/id-card-preview/mm/:mime1/:mime2/:name')
    async getMerchantIdentificationPreview(
        @Param('merchantId') merchantId: string,
        @Res() res: Response,
    ) {
        try {
            const fileData = await this.merchantService.getMerchantIdentification(
                merchantId,
            );

            if (!fileData) {
                throw new HttpException('File not found', HttpStatus.NOT_FOUND);
            }

            const fileStream = fs.createReadStream(fileData.filePath);

            res.setHeader('Content-Type', fileData.contentType);

            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming the file:', error);
                throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (error) {
            console.error('Error in getMerchantIdentificationPreview:', error);
            if (error instanceof HttpException) {
                res.status(error.getStatus()).json({ message: error.message });
            } else if (error instanceof HttpException) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'Internal server error',
                });
            }
        }
    }


    @Get(':merchantId/id-card-url')
    async getMerchantIdentifications(
        @Param('merchantId') merchantId: string,
        @Req() req,
    ) {
        try {
            const fileData = await this.merchantService.getMerchantIdentification(
                merchantId,
            );

            // delete fileData.filePath;

            // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${fileData.contentType}/${fileData.fileName}`;
            // const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${fileData.contentType}/${fileData.fileName}`;

            const downloadUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${fileData.contentType}/${fileData.fileName}`;
            const previewUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${fileData.contentType}/${fileData.fileName}`;


            return {
                ...fileData,
                imgUrl: downloadUrl,
                previewUrl: previewUrl,
            };
        } catch (error) {
            console.error('Error in getMerchantIdentifications:', error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':merchantId/cac')
    async getMerchantCACDocs(@Param('merchantId') merchantId: string, @Req() req) {
        try {
            const baseUrl = `https://${req.headers.host}/api/merchants`;

            const cacData = await this.merchantService.getMerchantCACDocs(
                merchantId,
                baseUrl,
            );

            return cacData;
        } catch (error) {
            console.error('Error in getMerchantCACDocs:', error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('cac/:merchantId/mm/:mimeType1/:mimetype2/doc/:name')
    async getMerchantCACDocument(
        @Param('merchantId') merchantId: string,
        @Param('mimeType1') mimetype1: string,
        @Param('mimetype2') mimetype2: string,
        @Param('name') filename: string,
        @Req() req,
        @Res() res: Response,
    ) {
        try {
            const mimeType = `${mimetype1}/${mimetype2}`;
            const cacData = await this.merchantService.getMerchantCACDocument(
                merchantId,
                filename,
                mimeType,
            );

            res.attachment(cacData.fileName);
            res.setHeader('Content-Type', cacData.contentType);

            // Send the file
            res.sendFile(cacData.filePath);
        } catch (error) {
            console.error('Error in getMerchantCACDocument:', error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }




    @Get('cac-preview/:merchantId/mm/:mimeType1/:mimetype2/doc/:name')
    async getMerchantCACDocumentPreview(
        @Param('merchantId') merchantId: string,
        @Param('mimeType1') mimetype1: string,
        @Param('mimetype2') mimetype2: string,
        @Param('name') filename: string,
        @Req() req,
        @Res() res: Response,
    ) {
        try {
            const mimeType = `${mimetype1}/${mimetype2}`;
            const cacData = await this.merchantService.getMerchantCACDocument(
                merchantId,
                filename,
                mimeType,
            );

            const fileStream = fs.createReadStream(cacData.filePath);

            res.setHeader('Content-Type', cacData.contentType);

            fileStream.pipe(res);

            fileStream.on('error', (error) => {
                console.error('Error streaming the file:', error);
                throw new HttpException('Error streaming the CAC file', HttpStatus.INTERNAL_SERVER_ERROR);
            });

            // res.attachment(cacData.fileName);
            // res.setHeader('Content-Type', cacData.contentType);

            // // Send the file
            // res.sendFile(cacData.filePath);
        } catch (error) {
            console.error('Error in getMerchantCACDocument:', error);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


}
