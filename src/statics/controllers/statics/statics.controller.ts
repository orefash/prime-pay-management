import { Controller, Get } from '@nestjs/common';
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

    @Get('nigeria-states')
    async getNigeriaStatesData() {
        return await this.staticsService.getNigeriaStatesData();
    }

    @Get('country-codes')
    async getCountryCodes() {
        return await this.staticsService.getCountryCodes();
    }
}
