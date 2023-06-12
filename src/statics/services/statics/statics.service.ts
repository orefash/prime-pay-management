import { Injectable } from '@nestjs/common';
import SERVICETYPES from '../../types/ServiceTypes';
import { IDTYPES } from '../../types/IDTypes'
import statesData from '../../types/NigeriaStateTypes';
import COUNTRY_CODES from '../../types/CountryCodes';
import PRODUCTCATEGORIES from 'src/statics/types/ProductTypes';

@Injectable()
export class StaticsService {

    async getIDTypes(){
        return IDTYPES;
    }

    async getServiceTypes():Promise<string[]> {
        return SERVICETYPES;
    }

    async getProductCategories():Promise<string[]> {
        return PRODUCTCATEGORIES;
    }

    async getNigeriaStatesData() {
        return statesData;
    }

    async getCountryCodes() {
        return COUNTRY_CODES;
    }

}
