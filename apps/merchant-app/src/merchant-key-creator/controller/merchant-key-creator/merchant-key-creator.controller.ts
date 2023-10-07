import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { MerchantKeyCreatorService } from '../../services/merchant-key-creator/merchant-key-creator.service';
import { CreateMerchantDto } from '../../../merchants/dto/CreateMerchant.dto';

@Controller('merchants')
export class MerchantKeyCreatorController {

    constructor(
        private readonly merchantProfileService: MerchantKeyCreatorService,

    ) { }


    @Post('create')
    @UsePipes(ValidationPipe)
    async createMerchant(@Body() createMerchantDto: CreateMerchantDto,) {

        try {

            let created = await this.merchantProfileService.createMerchantProfile(createMerchantDto);

            return {
                message: "Check your email for confirmation",
                success: true
            }

        } catch (error) {
            // console.log('create Merchant Profile error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('test-mail')
    async testMail() {
        try {
            return await this.merchantProfileService.testMailer();

        } catch (error) {
            console.log(error)
            console.log('in test mail 1 ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('test-token/:mid')
    async testToken(@Param('mid') mid: string) {
        try {

            return await this.merchantProfileService.testToken(mid);

        } catch (error) {
            console.log('in confirm token ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Get('test/:id')
    async getJobResult(@Param('id') id: string) {

        try {
            const job =  await this.merchantProfileService.getTestJob(id);

            const isCompleted = await job.isCompleted();

            if(!isCompleted)
                throw new Error("Is not complete")

            
            

            return job;

        } catch (error) {
            // console.log('create Merchant Profile error: ', error)
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

    }

}
