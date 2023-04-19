import { Controller, Get, Inject } from '@nestjs/common';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';

@Controller('3d')
export class ThirdPartyDataController {
    constructor(
        private readonly tdService: ThirdPartyDataService
    ){}

    @Get('banks')
    async getBankList(){
        return await this.tdService.getBankList();
    }

    

}
