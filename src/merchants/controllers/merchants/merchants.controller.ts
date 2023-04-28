import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { UpdateMerchantBankDto } from 'src/merchants/dto/UpdateMerchantBank.dto';

@Controller('merchants')
export class MerchantsController {
    constructor(
        // @Inject('MERCHANT_SERVICE')
        private readonly merchantService: MerchantsService
    ){}

    @Post('create')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createMerchantDto: CreateMerchantDto) {
        try {
            return await this.merchantService.createMerchant(createMerchantDto);
        } catch (error) {
            console.log('create error: ', error)
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
    async updateMerchant(@Param('id') merchantId: string, @Body() editMerchantDto: EditMerchantDto){
        return this.merchantService.updateMerchantProfile(merchantId, editMerchantDto);
    }

    @Patch('bank-details/:id')
    @UsePipes(ValidationPipe)
    async updateMerchantBank(@Param('id') merchantId: string, @Body() editMerchantBankDto: UpdateMerchantBankDto){
        return this.merchantService.updateMerchantBank(merchantId, editMerchantBankDto);
    }

    @Get('')
    getAllMerchants() {
        return this.merchantService.getAllMerchants();
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
