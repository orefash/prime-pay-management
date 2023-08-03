import { Controller, Get, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/utils/JWTAuthGuard';
import { StaticsService } from 'src/statics/services/statics/statics.service';

@Controller('statics')
export class StaticsController {
    constructor(
        private readonly staticsService: StaticsService
    ){}

    @Get('id-types')
    async getIDTypes(){
        return await this.staticsService.getIDTypes();
    }

    @Get('service-types')
    async getServiceTypes() {
        return await this.staticsService.getServiceTypes();
    }

    @Get('product-categories')
    async getProductCategories() {
        return await this.staticsService.getProductCategories();
    }

    @Get('nigeria-states')
    async getNigeriaStatesData() {
        return await this.staticsService.getNigeriaStatesData();
    }

    @Get('country-codes')
    async getCountryCodes() {
        return await this.staticsService.getCountryCodes();
    }

    @Get('transaction-statuses')
    async getTransactionStatuses() {
        return await this.staticsService.getTransactionStatuses();
    }

    @Get('transaction-channels')
    async getTransactionChannels() {
        return await this.staticsService.getTransactionChannels();
    }

    @Get('payout-statuses')
    async getPayoutStatuses() {
        return await this.staticsService.getPayoutStatuses();
    }

    @Get('payout-channels')
    async getPayoutChannels() {
        return await this.staticsService.getPayoutChannels();
    }
}
