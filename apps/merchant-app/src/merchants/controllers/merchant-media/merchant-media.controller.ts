import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MerchantsService } from '../../services/merchants/merchants.service';

import * as fs from 'fs';
import CustomFileInterceptor from 'apps/merchant-app/src/interceptors/file-upload.interceptor';
import { SetMerchantIdDTO } from '../../dto/SetMerchantIdentification.dto copy';
import { generateUniqueFilename } from '@app/utils/utils/file-upload';
import { SpacesService } from 'apps/merchant-app/src/digital-ocean/services/spaces/spaces.service';
import { unlinkSync } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { CACDocType, updateMerchantCACDocDTO } from '../../dto/SetCAC.dto';
import JwtAuthenticationGuard from 'apps/merchant-app/src/auth/utils/JWTAuthGuard';
import { SetMerchantLogoDto } from '../../dto/SetMerchantLogo.dto';

@Controller('merchants')
export class MerchantMediaController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,
        private readonly doSpacesService: SpacesService

    ) {

    }

    @Post(':merchantId/set-id-card')
    @UseInterceptors(
        CustomFileInterceptor(
            'promoterIdDoc',
            ['image/jpeg', 'image/png', 'application/pdf']
        ),
    )
    async setMerchantIdentification(
        @Req() req,
        @Body() setMerchantID: SetMerchantIdDTO,
        @UploadedFile() promoterIdDoc: Express.Multer.File,
        @Param('merchantId') merchantId: string,
    ) {
        if (!promoterIdDoc) {
            throw new HttpException('Means of ID not uploaded', HttpStatus.BAD_REQUEST);
        }

        try {

            // console.log("oldp: ", promoterIdDoc)
            // Generate a unique filename
            let uFileName = await generateUniqueFilename("MID", promoterIdDoc.originalname);


            let spaceFilename = `merchant-id/${uFileName}`;


            let fileUrl = await this.doSpacesService.uploadFile(promoterIdDoc.buffer, spaceFilename);


            // setMerchantID.promoterId = uFileName;
            setMerchantID.promoterIdUrl = fileUrl;
            setMerchantID.promoterIdMime = promoterIdDoc.mimetype;

            // // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;
            // // const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;


            // const downloadUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;
            // const previewUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;

            // console.log("in setID: ", fileUrl);
            // Save the merchant identification data to the database
            let data = await this.merchantService.setMerchantIdentification(merchantId, setMerchantID);

            // Return the download URL to the client
            return {
                message: "Merchant ID Set Successfully",
                idType: data.idType,
                // downloadUrl,
                previewUrl: fileUrl
            };
        } catch (error) {
            console.error('set ID error: ', error);
            // Delete the uploaded file if there is an error
            // unlinkSync(promoterIdDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Post(':merchantId/set-cac')
    @UseInterceptors(
        FilesInterceptor('files', 5, {

            storage: memoryStorage(),
            fileFilter: (req, file, callback) => {
                // Validate the file type
                const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (allowedTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error('Unsupported file type'), false);
                }
            },
        }),
    )
    async setMerchantCACDocs(
        @UploadedFiles() files: Express.Multer.File[],
        @Param('merchantId') merchantId: string,
        @Body() setCACDocs: updateMerchantCACDocDTO,
        @Req() req
    ) {

        try {


            // const baseUrl = `https://${req.headers.host}/api/merchants`;
            // const baseUrl = `${req.protocol}://${req.headers.host}/api/merchants`;



            // let fileUrl = 
            // console.log("oldp: ", files)

            let fileList: CACDocType[] = [];

            for (const file of files) {
                const path = file.path;
                const name = await generateUniqueFilename("CAC", file.originalname);
                let spaceFilename = `merchant-cac/${name}`;

                const mimeType = file.mimetype;
                // const url = `/cac/${merchantId}/mm/${mimeType}/doc/${name}`;
                const previewUrl = await this.doSpacesService.uploadFile(file.buffer, spaceFilename);
                // Process the file or save it to the database
                // console.log('Uploaded file:', filePath);
                // console.log('Uploaded file:', fileName);
                fileList.push({
                    name, path, mimeType, previewUrl
                })
            }

            setCACDocs.docs = fileList;
            setCACDocs.merchantID = merchantId;

            // let setCACDocs: updateMerchantCACDocDTO = {
            //     merchantID: merchantId,
            //     docs: fileList
            // }
            // console.log('data: ', setCACDocs);

            return await this.merchantService.setMerchantCACDocs(setCACDocs);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }




    @Post(':merchantId/set-logo')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(
        CustomFileInterceptor(
            'logoDoc',
            ['image/jpeg', 'image/png',]
        ),

    )
    async setMerchantLogo(
        @Req() req,
        @UploadedFile() logoDoc: Express.Multer.File,
        @Param('merchantId') merchantId: string,
    ) {
        if (!logoDoc) {
            throw new HttpException('Logo not uploaded', HttpStatus.BAD_REQUEST);
        }

        try {

            let uFileName = await generateUniqueFilename("ID", logoDoc.originalname);

            // Get the directory of the original file
            // const fileDir = dirname(logoDoc.path);

            // // Create the new file path by joining the original directory and the new filename
            // const newFilePath = join(fileDir, uFileName);

            // console.log("oldp: ", logoDoc)


            // renameSync(logoDoc.path, newFilePath);

            let spaceFilename = `merchant-logo/${uFileName}`;

            let logoUrl = await this.doSpacesService.uploadFile(logoDoc.buffer, spaceFilename);


            let setLogoDto: SetMerchantLogoDto = {
                logoUrl: logoUrl,
                logoMime: logoDoc.mimetype
            }

            // console.log('logodto: ', setLogoDto)

            // const downloadUrl = `https://${req.headers.host}/api/merchants/${merchantId}/logo`;
            // const previewUrl = `https://${req.headers.host}/api/merchants/${merchantId}/preview-logo`;
            // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/logo`;

            // console.log('du: ', downloadUrl)
            // console.log('prv: ', previewUrl)
            // Save the merchant identification data to the database
            await this.merchantService.setMerchantLogo(merchantId, setLogoDto);

            // renameSync(logoDoc.path, uFileName);


            // Return the download URL to the client
            return {
                message: "Merchant Logo Set Successfully",
                previewUrl: logoUrl
            };
        } catch (error) {
            console.log('set Logo error: ', error);
            // Delete the uploaded file if there is an error
            // unlinkSync(logoDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // @Get(':merchantId/logo')
    // async getMerchantLogo(
    //     @Param('merchantId') merchantId: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const fileData = await this.merchantService.getMerchantLogo(merchantId);

    //         if (!fileData) {
    //             throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
    //         }


    //         // console.log("Filepath: ", fileData)

    //         res.attachment(fileData.fileName);
    //         res.setHeader('Content-Type', fileData.contentType);

    //         res.sendFile(fileData.filePath);
    //     } catch (error) {
    //         console.error('Error in getMerchantLogo:', error);
    //         res.status(error.getStatus()).json({ message: error.message });
    //         // } else {
    //         //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //         //         message: 'Internal server error',
    //         //     });
    //         // }
    //     }
    // }


    // @Get(':merchantId/preview-logo')
    // async getMerchantLogoPreview(
    //     @Param('merchantId') merchantId: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const fileData = await this.merchantService.getMerchantLogo(merchantId);

    //         if (!fileData) {
    //             throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
    //         }

    //         // console.log("Filepath: ", fileData)

    //         const fileStream = fs.createReadStream(fileData.filePath);

    //         res.setHeader('Content-Type', fileData.contentType);

    //         fileStream.pipe(res);

    //         fileStream.on('error', (error) => {
    //             console.error('Error streaming the file:', error);
    //             throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
    //         });
    //     } catch (error) {
    //         console.error('Error in get Merchant Logo Preview:', error);
    //         if (error instanceof HttpException) {
    //             res.status(error.getStatus()).json({ message: error.message });
    //         } else if (error instanceof HttpException) {
    //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //                 message: 'Internal server error',
    //             });
    //         }
    //     }
    // }

    // @Get(':merchantId/id-card/mm/:mime1/:mime2/:name')
    // async getMerchantIdentification(
    //     @Param('merchantId') merchantId: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const fileData = await this.merchantService.getMerchantIdentification(
    //             merchantId,
    //         );

    //         if (!fileData) {
    //             throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    //         }

    //         const fileStream = fs.createReadStream(fileData.filePath);

    //         res.setHeader('Content-Type', fileData.contentType);

    //         fileStream.pipe(res);

    //         fileStream.on('error', (error) => {
    //             console.error('Error streaming the file:', error);
    //             throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
    //         });
    //     } catch (error) {
    //         console.error('Error in getMerchantIdentificationPreview:', error);
    //         if (error instanceof HttpException) {
    //             res.status(error.getStatus()).json({ message: error.message });
    //         } else if (error instanceof HttpException) {
    //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //                 message: 'Internal server error',
    //             });
    //         }
    //     }
    // }

    // @Get(':merchantId/id-card-preview/mm/:mime1/:mime2/:name')
    // async getMerchantIdentificationPreview(
    //     @Param('merchantId') merchantId: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const fileData = await this.merchantService.getMerchantIdentification(
    //             merchantId,
    //         );

    //         if (!fileData) {
    //             throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    //         }

    //         const fileStream = fs.createReadStream(fileData.filePath);

    //         res.setHeader('Content-Type', fileData.contentType);

    //         fileStream.pipe(res);

    //         fileStream.on('error', (error) => {
    //             console.error('Error streaming the file:', error);
    //             throw new HttpException('Error streaming the file', HttpStatus.INTERNAL_SERVER_ERROR);
    //         });
    //     } catch (error) {
    //         console.error('Error in getMerchantIdentificationPreview:', error);
    //         if (error instanceof HttpException) {
    //             res.status(error.getStatus()).json({ message: error.message });
    //         } else if (error instanceof HttpException) {
    //             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //                 message: 'Internal server error',
    //             });
    //         }
    //     }
    // }


    // @Get(':merchantId/id-card-url')
    // async getMerchantIdentifications(
    //     @Param('merchantId') merchantId: string,
    //     @Req() req,
    // ) {
    //     try {
    //         const fileData = await this.merchantService.getMerchantIdentification(
    //             merchantId,
    //         );

    //         // delete fileData.filePath;

    //         // const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${fileData.contentType}/${fileData.fileName}`;
    //         // const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${fileData.contentType}/${fileData.fileName}`;

    //         const downloadUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${fileData.contentType}/${fileData.fileName}`;
    //         const previewUrl = `https://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${fileData.contentType}/${fileData.fileName}`;


    //         return {
    //             ...fileData,
    //             imgUrl: downloadUrl,
    //             previewUrl: previewUrl,
    //         };
    //     } catch (error) {
    //         console.error('Error in getMerchantIdentifications:', error);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Get(':merchantId/cac')
    // async getMerchantCACDocs(@Param('merchantId') merchantId: string, @Req() req) {
    //     try {
    //         const baseUrl = `https://${req.headers.host}/api/merchants`;

    //         const cacData = await this.merchantService.getMerchantCACDocs(
    //             merchantId,
    //             baseUrl,
    //         );

    //         return cacData;
    //     } catch (error) {
    //         console.error('Error in getMerchantCACDocs:', error);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

    // @Get('cac/:merchantId/mm/:mimeType1/:mimetype2/doc/:name')
    // async getMerchantCACDocument(
    //     @Param('merchantId') merchantId: string,
    //     @Param('mimeType1') mimetype1: string,
    //     @Param('mimetype2') mimetype2: string,
    //     @Param('name') filename: string,
    //     @Req() req,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const mimeType = `${mimetype1}/${mimetype2}`;
    //         const cacData = await this.merchantService.getMerchantCACDocument(
    //             merchantId,
    //             filename,
    //             mimeType,
    //         );

    //         res.attachment(cacData.fileName);
    //         res.setHeader('Content-Type', cacData.contentType);

    //         // Send the file
    //         res.sendFile(cacData.filePath);
    //     } catch (error) {
    //         console.error('Error in getMerchantCACDocument:', error);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }




    // @Get('cac-preview/:merchantId/mm/:mimeType1/:mimetype2/doc/:name')
    // async getMerchantCACDocumentPreview(
    //     @Param('merchantId') merchantId: string,
    //     @Param('mimeType1') mimetype1: string,
    //     @Param('mimetype2') mimetype2: string,
    //     @Param('name') filename: string,
    //     @Req() req,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const mimeType = `${mimetype1}/${mimetype2}`;
    //         const cacData = await this.merchantService.getMerchantCACDocument(
    //             merchantId,
    //             filename,
    //             mimeType,
    //         );

    //         const fileStream = fs.createReadStream(cacData.filePath);

    //         res.setHeader('Content-Type', cacData.contentType);

    //         fileStream.pipe(res);

    //         fileStream.on('error', (error) => {
    //             console.error('Error streaming the file:', error);
    //             throw new HttpException('Error streaming the CAC file', HttpStatus.INTERNAL_SERVER_ERROR);
    //         });

    //         // res.attachment(cacData.fileName);
    //         // res.setHeader('Content-Type', cacData.contentType);

    //         // // Send the file
    //         // res.sendFile(cacData.filePath);
    //     } catch (error) {
    //         console.error('Error in getMerchantCACDocument:', error);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }


}
