import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMerchantDto } from 'src/merchants/dto/CreateMErchant.dto';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';

@Controller('merchants')
export class MerchantsController {
    constructor(
        @Inject('MERCHANT_SERVICE')
        private readonly merchantService: MerchantsService
    ){}

    @Post('create')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createMerchantDto: CreateMerchantDto) {
        try {
            return await this.merchantService.createMerchant(createMerchantDto);
        } catch (error) {
            console.log('create error')
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
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
