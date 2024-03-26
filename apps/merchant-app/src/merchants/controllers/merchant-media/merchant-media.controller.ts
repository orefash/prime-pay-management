import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { MerchantsService } from '../../services/merchants/merchants.service';

import * as fs from 'fs';
import CustomFileInterceptor from 'apps/merchant-app/src/interceptors/file-upload.interceptor';
import { IDDocType, updateMerchantIDDocDTO } from '../../dto/SetMerchantIdentification.dto';
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

    // @Post(':merchantId/set-id-card')
    // @UseInterceptors(
    //     CustomFileInterceptor(
    //         'promoterIdDoc',
    //         ['image/jpeg', 'image/png', 'application/pdf']
    //     ),
    // )
    // async setMerchantIdentification(
    //     @Req() req,
    //     @Body() setMerchantID: SetMerchantIdDTO,
    //     @UploadedFile() promoterIdDoc: Express.Multer.File,
    //     @Param('merchantId') merchantId: string,
    // ) {
    //     if (!promoterIdDoc) {
    //         throw new HttpException('Means of ID not uploaded', HttpStatus.BAD_REQUEST);
    //     }

    //     try {

    //         let uFileName = await generateUniqueFilename("MID", promoterIdDoc.originalname);


    //         let spaceFilename = `merchant-id/${uFileName}`;


    //         let fileUrl = await this.doSpacesService.uploadFile(promoterIdDoc.buffer, spaceFilename);

    //         setMerchantID.promoterIdUrl = fileUrl;
    //         setMerchantID.promoterIdMime = promoterIdDoc.mimetype;

    //         let data = await this.merchantService.setMerchantIdentification(merchantId, setMerchantID);

    //         return {
    //             message: "Merchant ID Set Successfully",
    //             idType: data.idType,
    //             // downloadUrl,
    //             previewUrl: fileUrl
    //         };
    //     } catch (error) {
    //         console.error('set ID error: ', error);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }


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


            let fileList: CACDocType[] = [];

            for (const file of files) {
                const path = file.path;
                const name = await generateUniqueFilename("CAC", file.originalname);
                let spaceFilename = `merchant-cac/${name}`;

                const mimeType = file.mimetype;
                const previewUrl = await this.doSpacesService.uploadFile(file.buffer, spaceFilename);
                fileList.push({
                    name, path, mimeType, previewUrl
                })
            }

            setCACDocs.docs = fileList;
            setCACDocs.merchantID = merchantId;

            return await this.merchantService.setMerchantCACDocs(setCACDocs);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }



    @Post(':merchantId/set-ids')
    @UseInterceptors(
        FilesInterceptor('files', 9, {

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
    async setMerchantIDs(
        @UploadedFiles() files: Express.Multer.File[],
        @Param('merchantId') merchantId: string,
        @Body() setIDDocs: updateMerchantIDDocDTO,
        @Req() req
    ) {

        try {


            let fileList: IDDocType[] = [];
            let idTypes: string[] = JSON.parse(setIDDocs.idTypes);

            for (const key in files) {
                const path = files[key].path;
                const name = await generateUniqueFilename("ID", files[key].originalname);
                let spaceFilename = `merchant-id/${name}`;

                const mimeType = files[key].mimetype;
                const previewUrl = await this.doSpacesService.uploadFile(files[key].buffer, spaceFilename);
                // console.log("Pv: ", previewUrl)
                fileList.push({
                    name, path, mimeType, previewUrl, idType: idTypes[key]
                })
            }

            setIDDocs.docs = fileList;
            setIDDocs.merchantID = merchantId;

            return await this.merchantService.setMerchantIDDocs(setIDDocs);
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

}
