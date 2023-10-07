import { Injectable } from '@nestjs/common';
import SERVICETYPES from '../../types/ServiceTypes';
import { IDTYPES } from '../../types/IDTypes'
import statesData from '../../types/NigeriaStateTypes';
import COUNTRY_CODES from '../../types/CountryCodes';
import PRODUCTCATEGORIES from '../../types/ProductTypes';
import { OrderChannel, TransactionStatus } from '../../../merchant-transaction/dto/CreateTransaction.dto';
import { PTransactionStatus } from '../../../merchant-payout/dto/CreatePayoutTransaction.dto';
import { PayoutChannels } from '../../../merchant-payout/statics/PayoutChannels';

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

    async getTransactionStatuses() : Promise<String[]>{
        return Object.values(TransactionStatus);
    }

    async getTransactionChannels() : Promise<String[]>{
        return Object.values(OrderChannel);
    }

    async getPayoutChannels() : Promise<String[]>{
        return Object.values(PayoutChannels);
    }

    async getPayoutStatuses() : Promise<String[]>{
        return Object.values(PTransactionStatus);
    }
    
    
}
