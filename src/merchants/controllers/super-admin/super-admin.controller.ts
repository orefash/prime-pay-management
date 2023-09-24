import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlinkSync } from 'fs';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { UpdateMerchantMIDDto } from 'src/merchants/dto/UpdateMerchantMID.dto';
import { SuperAdminService } from 'src/merchants/services/super-admin/super-admin.service';

@Controller('merchants')
export class SuperAdminController {
    constructor(
        private readonly adminService: SuperAdminService,
        private readonly configService: ConfigService,

    ) {

    }

    @Post('confirm-merchant/:id')
    // @UseGuards(JwtAuthenticationGuard)
    async confirmMerchant(@Param('id') merchantId: string) {
        try {
            return await this.adminService.setMerchantConfirmed(merchantId);
        } catch (error) {
            console.log('SA: confirm error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':id/systemID')
    @UsePipes(ValidationPipe)
    async updateMerchantMID(@Param('id') merchantId: string, @Body() editMerchantMIDDto: UpdateMerchantMIDDto) {
        try {
            return this.adminService.setMerchantMID(merchantId, editMerchantMIDDto);
        } catch (error) {
            // console.log('update merchant bank error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('upload')
    @UseInterceptors(
        CustomFileInterceptor(
            'file',
            ['image/jpeg', 'image/png']
        ),
    )
    async setTestFile(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new HttpException('filenot uploaded', HttpStatus.BAD_REQUEST);
        }

        try {

            // Return the download URL to the client
            return {
                message: "Merchant ID Set Successfully",
                name: file.filename,
            };
        } catch (error) {
            console.log('create error: ', error);
            // Delete the uploaded file if there is an error
            unlinkSync(file.path);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('')
    getAllMerchants() {
        return this.adminService.getAllMerchants(

        );
    }

}
