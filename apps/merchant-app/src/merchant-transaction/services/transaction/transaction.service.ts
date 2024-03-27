import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from '../../../merchant-customer/services/customer/customer.service';
import { CreatePayoutDto, PTransactionStatus } from '../../../merchant-payout/dto/CreatePayoutTransaction.dto';
import { MerchantPayoutService } from '../../../merchant-payout/services/merchant-payout/merchant-payout.service';
import { PayoutChannels } from '../../../merchant-payout/statics/PayoutChannels';
// import { CreateTransactionDto, TransactionStatus } from '../../dto/CreateTransaction.dto';
import { FindTransactionData } from '../../types/TransactionTypes';
import { ThirdPartyDataService } from '../../../third-party-data/services/third-party-data/third-party-data.service';
import { Merchant, MerchantTransaction as TransactionEntity } from '../../../typeorm';
import { mCustomer } from '../../../types/mCustomer.interface';
import { mTransaction } from '../../../types/mTransaction.interface';
import { Repository } from 'typeorm';
import { CreateTransactionDto, TransactionStatus, TransactionType } from '@app/db-lib/dto/CreateTransaction.dto';

@Injectable()
export class TransactionService {
    constructor
        (
            @InjectRepository(TransactionEntity)
            private readonly transactionRepository: Repository<TransactionEntity>,
            @InjectRepository(Merchant)
            private readonly merchantRepository: Repository<Merchant>,
            @Inject(CustomerService)
            private readonly customerService: CustomerService,
            @Inject(MerchantPayoutService)
            private readonly payoutService: MerchantPayoutService,
            @Inject(ThirdPartyDataService)
            private readonly thirdPartyService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService
        ) { }

    async createTransaction(createTransactionDto: CreateTransactionDto) {


        let merchant = null;

        if (createTransactionDto.transactionType === TransactionType.PAY_MERCHANT) {
            merchant = await this.merchantRepository.findOne({
                where: {
                    id: createTransactionDto.mid
                },
                select: ['id', 'name']
            });

            if (!merchant) {
                throw new Error("Invalid Merchant ID!!");
            }
        }

        let PPAY_STATUS = this.configService.get<number>('PPAY');

        console.log("in ct service - pp", PPAY_STATUS);



        if (createTransactionDto.transactionType === TransactionType.PAY_MERCHANT) {
            if (PPAY_STATUS == 0) {
                let payMerchantResponse = await this.thirdPartyService.payMerchant(createTransactionDto)

                if (!payMerchantResponse)
                    throw new Error('Not eligible for Loan')
            }

        }


        const customerData: mCustomer = {
            name: createTransactionDto.customerName,
            phone: createTransactionDto.customerPhone,
            ippis: createTransactionDto.ippis,
            email: createTransactionDto.customerEmail,
            isTest: createTransactionDto.isTest
        }

        const savedCustomer = await this.customerService.createCustomer(customerData);

        // console.log('in tr: ', savedCustomer)

        const transactionData: mTransaction = {
            isTest: createTransactionDto.isTest,
            amount: createTransactionDto.amount,
            orderChannel: createTransactionDto.orderChannel,
            description: createTransactionDto.description,
            merchant: merchant,
            transactionType: createTransactionDto.transactionType,
            customer: savedCustomer,
            loanTenor: createTransactionDto.loanTenor,
            agentCode: createTransactionDto.agentCode
        }

        console.log('transaction data - - : ', transactionData)

        const newTransaction = await this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(newTransaction);
    }

    async createDemoTransaction(createTransactionDto: CreateTransactionDto) {

        let merchant = null;

        console.log("Tr create: ", createTransactionDto)

        if (createTransactionDto.transactionType === TransactionType.PAY_MERCHANT) {
            merchant = await this.merchantRepository.findOne({
                where: {
                    id: createTransactionDto.mid
                },
                select: ['id', 'name']
            });

            if (!merchant) {
                throw new Error("Invalid Merchant ID!!");
            }
        }

        const customerData: mCustomer = {
            name: createTransactionDto.customerName,
            phone: createTransactionDto.customerPhone,
            ippis: createTransactionDto.ippis,
            isTest: createTransactionDto.isTest
        }

        const savedCustomer = await this.customerService.createCustomer(customerData);

        // console.log('in tr: ', savedCustomer)

        const transactionData: mTransaction = {
            amount: createTransactionDto.amount,
            orderChannel: createTransactionDto.orderChannel,
            description: createTransactionDto.description,
            merchant: merchant,
            isTest: createTransactionDto.isTest,
            transactionType: createTransactionDto.transactionType,
            customer: savedCustomer,
            loanTenor: createTransactionDto.loanTenor,
            agentCode: createTransactionDto.agentCode
        }

        console.log('transaction data - - : ', transactionData)

        const newTransaction = this.transactionRepository.create(transactionData);
        return await this.transactionRepository.save(newTransaction);
    }

    async getAllTransactions(): Promise<TransactionEntity[]> {



        return this.transactionRepository.find({
            relations: {
                customer: true
            },
            order: {
                orderDate: 'DESC'
            }
        });
    }

    async findEntities(
        whereConditions: Record<string, any>,
        searchQuery: string,
        pageNo: number,
        itemLimit: number, startDate: string, endDate: string
        // orderBy: Record<string, 'ASC' | 'DESC'>,
    ): Promise<FindTransactionData> {

        const queryBuilder = this.transactionRepository.createQueryBuilder('merchant_transaction')
            .leftJoinAndSelect('merchant_transaction.customer', 'customer');

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

        // console.log('cnt: ', totalCount)

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

    async getAllTransactionsByMode(isTest: boolean): Promise<TransactionEntity[]> {
        return this.transactionRepository.find({
            where: {
                isTest
            },
            relations: {
                customer: true
            },
            order: {
                orderDate: 'DESC'
            }
        });
    }

    async getMerchantTransactions(mid: number): Promise<TransactionEntity[]> {
        return this.transactionRepository.find({
            where: {
                merchant: {
                    systemId: mid
                }
            },
            relations: {
                customer: true
            },
            order: {
                orderDate: 'DESC'
            }
        });
    }

    async getTransactionById(tid: string): Promise<TransactionEntity> {
        const transaction = await this.transactionRepository.findOne({
            where: {
                id: tid
            },
            relations: {
                customer: true
            },
        });

        if (transaction) return transaction;

        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    async toggleTransactionDelivered(tid: string) {

        await this.transactionRepository.update(tid, {
            status: TransactionStatus.DELIVERED
        });

        const updatedTransaction = await this.transactionRepository.findOne({
            where: {
                id: tid
            }
        });

        if (updatedTransaction) {

            return updatedTransaction
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);

    }

    async toggleTransactionConfirmed(tid: string) {

        const nTransaction = await this.transactionRepository.findOne({
            where: {
                id: tid
            },
            select: {
                merchant: {
                    id: true,
                    availableBalance: true,
                    promoterFname: true
                }
            },
            relations: {
                merchant: true
            }
        });

        if(nTransaction.status === TransactionStatus.CONFIRMED)
            throw new Error("Transaction Already COnfirmed");


        await this.transactionRepository.update(tid, {
            status: TransactionStatus.CONFIRMED
        });


        const updatedTransaction = await this.transactionRepository.findOne({
            where: {
                id: tid
            },
            select: {
                merchant: {
                    id: true,
                    availableBalance: true,
                    promoterFname: true
                }
            },
            relations: {
                merchant: true
            }
        });


        console.log("tr: ", updatedTransaction)


        // console.log("trm: ", updatedTransaction.merchant)


        if (updatedTransaction && !updatedTransaction.isTest) {

            let merchant = await this.merchantRepository.findOne({
                where: {
                    id: updatedTransaction.merchant.id
                }
            })

        

            if (!merchant)
                throw new Error("Invalid Merchant ID");

            if(typeof updatedTransaction.amount === "string"){
                updatedTransaction.amount = parseFloat(updatedTransaction.amount);
            }

            let payout: CreatePayoutDto = {
                amount: updatedTransaction.amount,
                status: PTransactionStatus.SUCCESS,
                channel: PayoutChannels.INFLOW,
                isWithdraw: false,
                currency: 'NGN',
                mid: merchant.id
            }

            console.log("in transaction confirmed: payout - ", payout);

            try {
                //add to payout list
                let npayout = await this.payoutService.addTransactionToList(payout);
                return {
                    npayout,
                    // updatedTransaction
                }
            } catch (error) {
                console.log('Not added to Payout: ', error);
            }

            // return updatedTransaction
        }

        throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);

    }
}
