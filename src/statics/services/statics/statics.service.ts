import { Injectable } from '@nestjs/common';
import SERVICETYPES from '../../types/ServiceTypes';
import { IDTYPES } from '../../types/IDTypes'
import statesData from '../../types/NigeriaStateTypes';
import COUNTRY_CODES from '../../types/CountryCodes';

@Injectable()
export class StaticsService {

    async getIDTypes(){
        return IDTYPES;
    }

    async getServiceTypes():Promise<string[]> {
        return SERVICETYPES;
    }

    async getNigeriaStatesData() {
        return statesData;
    }

    async getCountryCodes() {
        return COUNTRY_CODES;
    }

}
