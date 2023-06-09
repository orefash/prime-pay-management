import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseFilters, UseInterceptors, UsePipes, ValidationPipe, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { UpdateMerchantBankDto } from 'src/merchants/dto/UpdateMerchantBank.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from 'src/merchants/dto/Upload.dto';
import { unlinkSync } from 'fs';
import { Address } from 'src/types/address.interface';
import { SetMerchantIdDTO } from 'src/merchants/dto/SetMerchantIdentification.dto copy';
import { SetMerchantLogoDto } from 'src/merchants/dto/SetMerchantLogo.dto';
import { SetCACDto } from 'src/merchants/dto/SetCAC.dto';
// import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { ConfigService } from '@nestjs/config';
import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';


@Controller('merchants')
export class MerchantsController {
    constructor(
        private readonly merchantService: MerchantsService,
        private readonly configService: ConfigService,

    ) {

    }



    @Post('activate-merchant/:id')
    @UseGuards(JwtAuthenticationGuard)
    async activateMerchant(@Param('id') merchantId: string) {
        try {
            return await this.merchantService.setMerchantActive(merchantId);
        } catch (error) {
            console.log('create error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }



    @Patch('profile/:id')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(ValidationPipe)
    async updateMerchant(@Param('id') merchantId: string, @Body() editMerchantDto: EditMerchantDto) {
        try {
            return this.merchantService.updateMerchantProfile(merchantId, editMerchantDto);
        } catch (error) {
            console.log('update error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Patch(':id/systemId/:mid')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(ValidationPipe)
    async updateMerchantSystemId(@Param('id') id: string, @Param('mid') systemId: number) {
        try {
            return this.merchantService.updateMerchantSystemId(id, systemId);
        } catch (error) {
            console.log('update systemid error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Patch('bank-details/:id')
    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(ValidationPipe)
    async updateMerchantBank(@Param('id') merchantId: string, @Body() editMerchantBankDto: UpdateMerchantBankDto) {
        return this.merchantService.updateMerchantBank(merchantId, editMerchantBankDto);
    }

    @Get('')
    getAllMerchants() {
        return this.merchantService.getAllMerchants(

        );
    }

    @Get(':merchantId')
    @UseGuards(JwtAuthenticationGuard)
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

    @Get(':merchantId/id-card')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantIdentification(@Param('merchantId') merchantId: string, @Res() res: Response) {
        let fileData = await this.merchantService.getMerchantIdentification(merchantId);
        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }

    @Get(':merchantId/logo')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantLogo(@Param('merchantId') merchantId: string, @Res() res: Response) {
        let fileData = await this.merchantService.getMerchantLogo(merchantId);
        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }

    @Get(':merchantId/cac')
    // @UseGuards(JwtAuthenticationGuard)
    async getMerchantCAC(@Param('merchantId') merchantId: string, @Res() res: Response) {
        let fileData = await this.merchantService.getMerchantCAC(merchantId);
        res.attachment(fileData.fileName);
        res.setHeader('Content-Type', fileData.contentType);

        // Send the file
        res.sendFile(fileData.filePath);
    }


    @Post(':merchantId/set-id-card')
    @UseGuards(JwtAuthenticationGuard)
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
            setMerchantID.promoterId = promoterIdDoc.filename;
            setMerchantID.promoterIdMime = promoterIdDoc.mimetype;

            const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/id-card`;

            // console.log('du: ', downloadUrl)
            // Save the merchant identification data to the database
            await this.merchantService.setMerchantIdentification(merchantId, setMerchantID);

            // Return the download URL to the client
            return {
                message: "Merchant ID Set Successfully",
                downloadUrl,
            };
        } catch (error) {
            console.log('create error: ', error);
            // Delete the uploaded file if there is an error
            unlinkSync(promoterIdDoc.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    @Post(':merchantId/set-cac')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(
        CustomFileInterceptor(
            'cacDoc',
            ['image/jpeg', 'image/png', 'application/pdf']
        ),
    )
    async setMerchantCAC(
        @Req() req,
        @UploadedFile() cacDoc: Express.Multer.File,
        @Param('merchantId') merchantId: string,
    ) {
        if (!cacDoc) {
            throw new HttpException('CAC Doc not uploaded', HttpStatus.BAD_REQUEST);
        }

        try {
            let cacDto: SetCACDto = {
                cacPath: cacDoc.filename,
                cacMime: cacDoc.mimetype
            }

            const downloadUrl = `${req.protocol}://${req.headers.host}/api/merchants/${merchantId}/cac`;

            // console.log('du: ', downloadUrl)
            // Save the merchant identification data to the database
            await this.merchantService.setMerchantCAC(merchantId, cacDto);

            // Return the download URL to the client
            return {
                message: "Merchant CAC Set Successfully",
                downloadUrl,
            };
        } catch (error) {
            console.log('create error: ', error);
            // Delete the uploaded file if there is an error
            unlinkSync(cacDoc.path);
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
            let setLogoDto: SetMerchantLogoDto = {
                logoPath: logoDoc.filename,
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

