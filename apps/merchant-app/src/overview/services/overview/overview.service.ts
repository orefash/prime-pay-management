import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { MerchantTransaction as TransactionEntity, MerchantCustomer, Merchant } from '../../../typeorm';
import { MerchantOverview } from '../../../types/merchant-overview.interface';
import { Repository } from 'typeorm';

@Injectable()
export class OverviewService {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionRepository: Repository<TransactionEntity>,
        @InjectRepository(MerchantCustomer)
        private readonly customerRepository: Repository<MerchantCustomer>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>

    ) { }

    async getOverviewData(mid: string, isTest: boolean): Promise<MerchantOverview> {

        let overviewdata: MerchantOverview = {
            salesCount: 0,
            transactionValue: 'NGN 0.00',
            payoutBalance: 'NGN 0.00',
            customers: 0
        };

        try {

            // let merchant = await this.merchantRepository.findOne({
            //     where: {
            //         id: mid
            //     }
            // });

            // if(!merchant)
            //     throw new Error("Merchant not Found")

            // console.log("SysId: ", merchant.systemId);

            let transactionData = await this.transactionRepository
                .createQueryBuilder('merchant_transaction')
                .where("merchant_transaction.merchantId= :mid", { mid: mid })
                .andWhere("merchant_transaction.isTest= :isTest", { isTest: isTest })
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
            console.log("error: ", error)
            throw new HttpException('Merchant Overview Error', HttpStatus.BAD_REQUEST);
        }


    }

}
