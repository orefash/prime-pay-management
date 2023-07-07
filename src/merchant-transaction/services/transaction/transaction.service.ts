import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/merchant-customer/services/customer/customer.service';
import { CreateTransactionDto, TransactionStatus } from 'src/merchant-transaction/dto/CreateTransaction.dto';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';
import { MerchantTransaction as TransactionEntity } from 'src/typeorm';
import { mCustomer } from 'src/types/mCustomer.interface';
import { mTransaction } from 'src/types/mTransaction.interface';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
    constructor
        (
            @InjectRepository(TransactionEntity)
            private readonly transactionRepository: Repository<TransactionEntity>,
            @Inject(CustomerService)
            private readonly customerService: CustomerService,
            @Inject(ThirdPartyDataService)
            private readonly thirdPartyService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService
        ) { }

    async createTransaction(createTransactionDto: CreateTransactionDto) {

        let PPAY_STATUS = this.configService.get<number>('PPAY');

        console.log("in ct service - pp", PPAY_STATUS)

        if(PPAY_STATUS == 0){
            let payMerchantResponse = await this.thirdPartyService.payMerchant(createTransactionDto)

            if(!payMerchantResponse)
                throw new Error('Not eligible for Loan')
        }

        const customerData: mCustomer = {
            name: createTransactionDto.customerName,
            phone: createTransactionDto.customerPhone,
            ippis: createTransactionDto.ippis,
            email: createTransactionDto.customerEmail
        }

        const savedCustomer = await this.customerService.createCustomer(customerData);

        // console.log('in tr: ', savedCustomer)

        const transactionData: mTransaction = {
            amount: createTransactionDto.amount,
            orderChannel: createTransactionDto.orderChannel,
            description: createTransactionDto.description,
            mid: createTransactionDto.mid,
            customer: savedCustomer,
            loanTenor: createTransactionDto.loanTenor
        }

        // console.log('ts: ', transactionData)

        const newTransaction = await this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(newTransaction);
    }

    async createDemoTransaction(createTransactionDto: CreateTransactionDto) {

        const customerData: mCustomer = {
            name: createTransactionDto.customerName,
            phone: createTransactionDto.customerPhone,
            ippis: createTransactionDto.ippis
        }

        const savedCustomer = await this.customerService.createCustomer(customerData);

        console.log('in tr: ', savedCustomer)

        const transactionData: mTransaction = {
            amount: createTransactionDto.amount,
            orderChannel: createTransactionDto.orderChannel,
            description: createTransactionDto.description,
            mid: createTransactionDto.mid,
            customer: savedCustomer,
            loanTenor: createTransactionDto.loanTenor
        }

        console.log('ts: ', transactionData)

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

    async getMerchantTransactions(mid: number): Promise<TransactionEntity[]> {
        return this.transactionRepository.find({
            where: {
                mid: mid
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

        if(transaction) return transaction;

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

        await this.transactionRepository.update(tid, {
            status: TransactionStatus.CONFIRMED
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
}
