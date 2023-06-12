import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { StaticsService } from 'src/statics/services/statics/statics.service';

@Controller('statics')
export class StaticsController {
    constructor(
        private readonly staticsService: StaticsService
    ){}

    @Get('id-types')
    // @UseGuards(JwtAuthenticationGuard)
    async getIDTypes(){
        return await this.staticsService.getIDTypes();
    }

    @Get('service-types')
    // @UseGuards(JwtAuthenticationGuard)
    async getServiceTypes() {
        return await this.staticsService.getServiceTypes();
    }

    @Get('product-categories')
    // @UseGuards(JwtAuthenticationGuard)
    async getProductCategories() {
        return await this.staticsService.getProductCategories();
    }

    @Get('nigeria-states')
    // @UseGuards(JwtAuthenticationGuard)
    async getNigeriaStatesData() {
        return await this.staticsService.getNigeriaStatesData();
    }

    @Get('country-codes')
    // @UseGuards(JwtAuthenticationGuard)
    async getCountryCodes() {
        return await this.staticsService.getCountryCodes();
    }
}
