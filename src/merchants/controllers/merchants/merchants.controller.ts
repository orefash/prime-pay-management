import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { UpdateMerchantBankDto } from 'src/merchants/dto/UpdateMerchantBank.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from 'src/merchants/dto/Upload.dto';
import { unlinkSync } from 'fs';
import { Address } from 'src/types/address.interface';
// import { CreateUploadsFolderMiddleware } from 'src/middleware/create-upload-folder.middleware';


@Controller('merchants')
export class MerchantsController {
    constructor(
        private readonly merchantService: MerchantsService,
    ) { }

    @Post('create')
    @UseInterceptors(
        FileInterceptor('promoterIdDoc', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    // generate a unique filename with the original extension
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    const originalName = file.originalname.split('.').slice(0, -1).join('.');
                    const extension = file.originalname.split('.').pop();
                    callback(null, `${originalName}-${uniqueSuffix}.${extension}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error('File type not allowed'), false);
                }
            },
            limits: {
                fileSize: 1024 * 1024 * 3, // 1MB
            },
        }))
    @UsePipes(ValidationPipe)
    async createMerchantTest(@Body() createMerchantDto: CreateMerchantDto, @UploadedFile() promoterIdDoc: Express.Multer.File,) {
       
        if (!promoterIdDoc)
            throw new HttpException("Means of ID not uploaded", HttpStatus.BAD_REQUEST);

        const filepath = promoterIdDoc.path;
        try {

            createMerchantDto.promoterId = filepath;

            let address: Address = {
                street: createMerchantDto.street,
                no: parseInt(createMerchantDto.streetNo, 10),
                country: createMerchantDto.country,
                state: createMerchantDto.state,
                landmark: createMerchantDto.landmark,
                lga: createMerchantDto.lga
            }

            createMerchantDto.address = address;

            return await this.merchantService.createMerchant(createMerchantDto);
            
        } catch (error) {
            console.log('create error: ', error)
            unlinkSync(filepath);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    

    @Post('activate-merchant/:id')
    async activateMerchant(@Param('id') merchantId: string) {
        try {
            return await this.merchantService.setMerchantActive(merchantId);
        } catch (error) {
            console.log('create error: ', error)
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
    async updateMerchantBank(@Param('id') merchantId: string, @Body() editMerchantBankDto: UpdateMerchantBankDto) {
        return this.merchantService.updateMerchantBank(merchantId, editMerchantBankDto);
    }

    @Get('')
    getAllMerchants() {
        return this.merchantService.getAllMerchants(
            
        );
    }

    @Get(':merchantId')
    getMerchantById(@Param('merchantId') merchantId: string) {
        return this.merchantService.getMerchantById(merchantId);
    }


    // @Get(':email')
    // getUsers(@Param('merchantId') merchantId: string) {
    //     return this.merchantService.getMerchantById(merchantId);
    // }
}

