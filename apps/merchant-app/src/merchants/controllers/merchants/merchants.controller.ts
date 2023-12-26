import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseFilters, UseInterceptors, UsePipes, ValidationPipe, Res, UseGuards } from '@nestjs/common';

import { EditMerchantDto } from '../../dto/UpdateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { renameSync, unlinkSync } from 'fs';
import { SetMerchantIdDTO } from '../../dto/SetMerchantIdentification.dto copy';
import { SetMerchantLogoDto } from '../../dto/SetMerchantLogo.dto';
import { CACDocType, updateMerchantCACDocDTO } from '../../dto/SetCAC.dto';
// import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { ConfigService } from '@nestjs/config';
import CustomFileInterceptor from '../../../interceptors/file-upload.interceptor';
import JwtAuthenticationGuard from '../../../auth/utils/JWTAuthGuard';
import { generateUniqueFilename } from '../../../utils/file-upload';
import { dirname, join } from 'path';
import { UpdateBankDto } from '@app/db-lib/dto/UpdateBankDetails.dto';


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


    @Patch('bank-details/:id')
    @UsePipes(ValidationPipe)
    async updateMerchantBank(@Param('id') merchantId: string, @Body() editMerchantBankDto: UpdateBankDto) {
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



   

}

