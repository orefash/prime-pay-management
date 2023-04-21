import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
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

    ) { }

    async getOverviewData(mid: string): Promise<MerchantOverview> {

        let overviewdata: MerchantOverview = {
            salesCount: 0,
            transactionValue: '₦0',
            payoutBalance: '₦0',
            customers: 0
        };

        try {
            let transactionData = await this.transactionRepository
                .createQueryBuilder('merchant_transaction')
                .where("merchant_transaction.mid= :mid", { mid: mid })
                .select('SUM(merchant_transaction.amount)', 'totalAmount')
                .addSelect('COUNT(*)', 'count')
                .addSelect('COUNT(DISTINCT(merchant_transaction.customer))', 'customerCount')
                .getRawOne();

            // console.log('trd: ', transactionData);


            overviewdata.salesCount = transactionData.count;
            overviewdata.transactionValue = transactionData.totalAmount == null ? '₦0' : '₦'+transactionData.totalAmount;
            overviewdata.payoutBalance = '₦0';
            overviewdata.customers = transactionData.customerCount;

            return overviewdata;

        } catch (error) {
            throw new HttpException('Merchant Overview Error', HttpStatus.BAD_REQUEST);
        }


    }

}
