import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { MerchantsService } from '../../services/merchants/merchants.service';

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

    @Patch('profile/:id')
    @UsePipes(ValidationPipe)
    async updateMerchant(@Param('id') merchantId: string, @Body() editMerchantDto: EditMerchantDto){
        return this.merchantService.updateMerchantProfile(merchantId, editMerchantDto);
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
