import { MerchantCustomer } from '@app/db-lib/models/MerchantCustomer';
import { MerchantTransaction } from '@app/db-lib/models/MerchantTransaction';
import { BaseOverview } from '@app/db-lib/types/overview.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OverviewService {
    constructor(
        @InjectRepository(MerchantTransaction)
        private readonly transactionRepository: Repository<MerchantTransaction>,
        @InjectRepository(MerchantCustomer)
        private readonly customerRepository: Repository<MerchantCustomer>

    ) { }

    async getOverviewData(agentCode: string): Promise<BaseOverview> {

        let overviewdata: BaseOverview = {
            salesCount: 0,
            transactionValue: 'NGN 0.00',
            payoutBalance: 'NGN 0.00',
            customers: 0
        };

        try {
            let transactionData = await this.transactionRepository
                .createQueryBuilder('merchant_transaction')
                .where("merchant_transaction.agentCode= :agentCode", { agentCode: agentCode })
                .andWhere("merchant_transaction.isTest= :isTest", { isTest: false })
                // .andWhere("merchant_transaction.isTest= :isTest", { isTest: false })
                .select('SUM(merchant_transaction.amount)', 'totalAmount')
                .addSelect('COUNT(*)', 'count')
                .addSelect('COUNT(DISTINCT(merchant_transaction.customer))', 'customerCount')
                .getRawOne();

            // console.log('trd: ', transactionData);


            overviewdata.salesCount = transactionData.count;
            overviewdata.transactionValue = transactionData.totalAmount == null ? 'NGN 0.00' : 'NGN '+transactionData.totalAmount;
            overviewdata.payoutBalance = 'NGN 0.00';
            overviewdata.customers = transactionData.customerCount;

            return overviewdata;

        } catch (error) {
            throw new HttpException('AGent Overview Error', HttpStatus.BAD_REQUEST);
        }


    }
}
