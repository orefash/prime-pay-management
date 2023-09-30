import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseFilters, UseInterceptors, UsePipes, ValidationPipe, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { UpdateMerchantBankDto } from 'src/merchants/dto/UpdateMerchantBank.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from 'src/merchants/dto/Upload.dto';
import { renameSync, unlinkSync } from 'fs';
import { Address } from 'src/types/address.interface';
import { SetMerchantIdDTO } from 'src/merchants/dto/SetMerchantIdentification.dto copy';
import { SetMerchantLogoDto } from 'src/merchants/dto/SetMerchantLogo.dto';
import { CACDocType, updateMerchantCACDocDTO } from 'src/merchants/dto/SetCAC.dto';
// import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { ConfigService } from '@nestjs/config';
import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { UpdateMerchantMIDDto } from 'src/merchants/dto/UpdateMerchantMID.dto';
import { generateUniqueFilename } from 'src/utils/file-upload';
import { dirname, join } from 'path';


@Controller('merchants')
export class MerchantsController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,

    ) {

    }



    @Post('toggle-merchant-active/:id')
    @UseGuards(JwtAuthenticationGuard)
    async activateMerchant(@Param('id') merchantId: string) {
        try {
            return await this.merchantService.toggleMerchantActive(merchantId);
        } catch (error) {
            console.log('toggle active error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Post('verify-merchant/:id')
    @UseGuards(JwtAuthenticationGuard)
    async verifyMerchant(@Param('id') merchantId: string) {
        try {
            return await this.merchantService.verifyMerchant(merchantId);
        } catch (error) {
            console.log('verify error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }




    @Patch('profile/:id')
    @UsePipes(ValidationPipe)
    async updateMerchant(@Param('id') merchantId: string, @Body() editMerchantDto: EditMerchantDto) {
        try {
            return this.merchantService.updateMerchantProfile(merchantId, editMerchantDto);
        } catch (error) {
            console.log('update error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    // @Patch(':id/systemId/:mid')
    // @UsePipes(ValidationPipe)
    // async updateMerchantSystemId(@Param('id') id: string, @Param('mid') systemId: number) {
    //     try {
    //         return this.merchantService.updateMerchantSystemId(id, systemId);
    //     } catch (error) {
    //         console.log('update systemid error: ', error)
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }


    @Patch('bank-details/:id')
    @UsePipes(ValidationPipe)
    async updateMerchantBank(@Param('id') merchantId: string, @Body() editMerchantBankDto: UpdateMerchantBankDto) {
        try {
            return this.merchantService.updateMerchantBank(merchantId, editMerchantBankDto);
        } catch (error) {
            // console.log('update merchant bank error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }



    @Get(':merchantId/balance')
    async getMerchantBalance(
        @Param('merchantId') merchantId: string) {

        try {
            let merchant = await this.merchantService.getMerchantBalance(merchantId);

            let data = {
                ...merchant,
            };
            return data;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);

        }

    }



    @Get(':merchantId')
    async getMerchantById(
        @Param('merchantId') merchantId: string,
        @Req() req) {
        let merchant = await this.merchantService.getMerchantById(merchantId);

        const logoUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/logo`;
        // console.log(`req: ${logoUrl}`)

        let data = {
            ...merchant,
            logoUrl: logoUrl,
        };

        return data;
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
    //         let uFileName = await generateUniqueFilename("ID", promoterIdDoc.filename);
    //         // console.log("uf: ", uFileName);

    //         setMerchantID.promoterId = uFileName;
    //         setMerchantID.promoterIdMime = promoterIdDoc.mimetype;

    //         const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;

    //         const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;

    //         // console.log('file-obj: ', setMerchantID)
    //         // Save the merchant identification data to the database
    //         let data = await this.merchantService.setMerchantIdentification(merchantId, setMerchantID);

    //         // Return the download URL to the client
    //         return {
    //             message: "Merchant ID Set Successfully",
    //             idType: data.idType,
    //             downloadUrl,
    //             previewUrl
    //         };
    //     } catch (error) {
    //         console.log('set ID error: ', error);
    //         // Delete the uploaded file if there is an error
    //         unlinkSync(promoterIdDoc.path);
    //         throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    //     }
    // }

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
            // Generate a unique filename
            let uFileName = await generateUniqueFilename("ID", promoterIdDoc.filename);

            // Get the directory of the original file
            const fileDir = dirname(promoterIdDoc.path);

            // Create the new file path by joining the original directory and the new filename
            const newFilePath = join(fileDir, uFileName);

            // Rename the uploaded file to the new filename while preserving the directory structure
            renameSync(promoterIdDoc.path, newFilePath);

            setMerchantID.promoterId = uFileName;
            setMerchantID.promoterIdMime = promoterIdDoc.mimetype;

            const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;
            const previewUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card-preview/mm/${setMerchantID.promoterIdMime}/${setMerchantID.promoterId}`;

            // Save the merchant identification data to the database
            let data = await this.merchantService.setMerchantIdentification(merchantId, setMerchantID);

            // Return the download URL to the client
            return {
                message: "Merchant ID Set Successfully",
                idType: data.idType,
                downloadUrl,
                previewUrl
            };
        } catch (error) {
            console.error('set ID error: ', error);
            // Delete the uploaded file if there is an error
            unlinkSync(promoterIdDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Post(':merchantId/set-cac')
    @UseInterceptors(
        FilesInterceptor('files', 5, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const extension = file.mimetype.split('/')[1];
                    callback(null, 'CAC' + '-' + uniqueSuffix + '.' + extension);
                },
            }),
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


            const baseUrl = `${req.protocol}://${req.headers.host}/api/merchants`;

            let fileList: CACDocType[] = [];

            for (const file of files) {
                const path = file.path;
                const name = file.filename;
                const mimeType = file.mimetype;
                const url = `/cac/${merchantId}/mm/${mimeType}/doc/${name}`;
                const previewUrl = `/cac-preview/${merchantId}/mm/${mimeType}/doc/${name}`;
                // Process the file or save it to the database
                // console.log('Uploaded file:', filePath);
                // console.log('Uploaded file:', fileName);
                fileList.push({
                    name, path, mimeType, docUrl: url, previewUrl
                })
            }

            setCACDocs.docs = fileList;
            setCACDocs.merchantID = merchantId;

            // let setCACDocs: updateMerchantCACDocDTO = {
            //     merchantID: merchantId,
            //     docs: fileList
            // }
            // console.log('data: ', setCACDocs);

            return await this.merchantService.setMerchantCACDocs(setCACDocs, baseUrl);
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

            let uFileName = await generateUniqueFilename("ID", logoDoc.filename);

            let setLogoDto: SetMerchantLogoDto = {
                logoPath: uFileName,
                logoMime: logoDoc.mimetype
            }

            console.log('logodto: ', setLogoDto)

            const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/logo`;

            console.log('du: ', downloadUrl)
            // Save the merchant identification data to the database
            await this.merchantService.setMerchantLogo(merchantId, setLogoDto);

            // Return the download URL to the client
            return {
                message: "Merchant Logo Set Successfully",
                downloadUrl,
            };
        } catch (error) {
            console.log('create error: ', error);
            // Delete the uploaded file if there is an error
            unlinkSync(logoDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}

