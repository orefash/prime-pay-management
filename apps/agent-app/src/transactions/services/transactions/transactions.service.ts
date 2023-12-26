import { MerchantTransaction } from '@app/db-lib/models/MerchantTransaction';
import { FindTransactionData } from '@app/db-lib/types/TransactionTypes';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'apps/agent-app/src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionsService {
    constructor
    (
        @InjectRepository(MerchantTransaction)
        private readonly transactionRepository: Repository<MerchantTransaction>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        // @Inject(CustomerService)
        // private readonly customerService: CustomerService,
        // @Inject(MerchantPayoutService)
        // private readonly payoutService: MerchantPayoutService,
        // @Inject(ThirdPartyDataService)
        // private readonly thirdPartyService: ThirdPartyDataService,
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ) { }

    async getTransactionById(tid: string): Promise<MerchantTransaction> {
        // const transaction = await this.transactionRepository.findOne({
        //     where: {
        //         id: tid
        //     },
        //     relations: ['merchant', 'customer'],
        // });

        // const transaction = await this.transactionRepository.findOne({
        //         where: {
        //             id: tid
        //         },
        //         relations: {
        //             merchant: true,
        //             customer: true
        //         },
        //     });

        const transaction = await this.transactionRepository.createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.customer', 'customer')
        .leftJoinAndSelect('transaction.merchant', 'merchant')
        .where('transaction.id = :id', { id: tid })
        .getOne();

        if (transaction) return transaction;

        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    async findEntities(
        agentCode: string,
        whereConditions: Record<string, any>,
        searchQuery: string,
        pageNo: number,
        itemLimit: number, startDate: string, endDate: string
        // orderBy: Record<string, 'ASC' | 'DESC'>,
    ): Promise<FindTransactionData> {
 
        const queryBuilder = this.transactionRepository.createQueryBuilder('merchant_transaction')
            .leftJoinAndSelect('merchant_transaction.customer', 'customer');

            queryBuilder.innerJoinAndSelect("merchant_transaction.merchant", "merchant")
        // queryBuilder.leftJoinAndSelect(Merchant, "merchant", "merchant.id = transaction.mid")
        //transaction is live
        queryBuilder.andWhere(`merchant_transaction.isTest = :isTest`, { isTest: false });
        //filter by agentcode
        queryBuilder.andWhere(`merchant_transaction.agentCode = :agentCode`, { agentCode: agentCode });

        // Add WHERE conditions dynamically
        Object.entries(whereConditions).forEach(([key, value]) => {
            queryBuilder.andWhere(`merchant_transaction.${key} = :${key}`, { [key]: value });
        });

        // Add ORDER BY dynamically
        // Object.entries(orderBy).forEach(([key, value]) => {
        //   queryBuilder.addOrderBy(`merchant_transaction.${key}`, value);
        // });

        if (searchQuery) {
            if (!isNaN(Number(searchQuery))) {
                // Search query is a number
                queryBuilder.andWhere(`merchant_transaction.amount = :searchQueryNum`, {
                    searchQueryNum: Number(searchQuery),
                });
            } else {
                // Search query is a string
                queryBuilder.andWhere(`customer.name ILIKE :searchQueryString`, {
                    searchQueryString: `%${searchQuery}%`,
                });
            }
        }

        if (startDate && endDate) {
            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            queryBuilder.andWhere("merchant_transaction.orderDate BETWEEN :startDate AND :endDate", {
                startDate: startDateObject,
                endDate: endDateObject,
            });
        } else if (startDate) {
            // Only startDate is provided
            console.log("Only startDate is provided")
            const startDateObject = new Date(startDate);
            queryBuilder.andWhere("merchant_transaction.orderDate >= :startDate", {
                startDate: startDateObject,
            });
        } else if (endDate) {
            // Only endDate is provided
            const endDateObject = new Date(endDate);
            queryBuilder.andWhere("merchant_transaction.orderDate <= :endDate", {
                endDate: endDateObject,
            });
        }

        queryBuilder.addOrderBy(`merchant_transaction.orderDate`, "DESC");

        // Count the total number of entities that match the conditions
        const totalCount = await queryBuilder.getCount();

        console.log('cnt: ', totalCount)

        // Calculate the total number of pages based on the total count and the item limit
        const totalPages = Math.ceil(totalCount / itemLimit);


        if (pageNo && itemLimit) {
            let skipValue = (pageNo - 1) * itemLimit;
            queryBuilder.skip(skipValue)
                .take(itemLimit);
        }

        let queryResponse =
            await queryBuilder.getMany();
        
        const data: FindTransactionData = {
            data: queryResponse,
            totalPageNo: totalPages
        }

        return data;
    }
}
