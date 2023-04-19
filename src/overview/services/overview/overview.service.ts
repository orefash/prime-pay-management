import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantTransaction as TransactionEntity, MerchantCustomer } from 'src/typeorm'; 
import { MerchantOverview } from 'src/types/merchant-overview.interface';
import { Repository } from 'typeorm';

@Injectable()
export class OverviewService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(MerchantCustomer)
        private readonly customerRepository: Repository<MerchantCustomer>

    ){}

    async getOverviewData(): Promise<MerchantOverview> {

        let overviewdata: MerchantOverview = null;

        


        return overviewdata;
    }

}
