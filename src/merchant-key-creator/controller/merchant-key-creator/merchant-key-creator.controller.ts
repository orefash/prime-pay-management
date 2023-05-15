import { Body, Controller, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MerchantKeyCreatorService } from 'src/merchant-key-creator/services/merchant-key-creator/merchant-key-creator.service';
import { CreateMerchantDto } from 'src/merchants/dto/CreateMerchant.dto';

@Controller('merchants')
export class MerchantKeyCreatorController {

    constructor(
        private readonly merchantProfileService: MerchantKeyCreatorService,

    ) { }


    @Post('create')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createMerchantDto: CreateMerchantDto,) {

        try {

            return await this.merchantProfileService.createMerchantProfile(createMerchantDto);

        } catch (error) {
            console.log('create Merchant Profile error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
