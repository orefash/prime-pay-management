import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/merchant-customer/services/customer/customer.service';
import { CreateTransactionDto } from 'src/merchant-transaction/dto/CreateTransaction.dto';
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
        private readonly customerService: CustomerService
    ){}

    async createTransaction(createTransactionDto: CreateTransactionDto) {

        const customerData: mCustomer = {
            name: createTransactionDto.customerName,
            phone: createTransactionDto.customerPhone
        }

        const savedCustomer = await this.customerService.createCustomer(customerData);

        console.log('in tr: ', savedCustomer)

        const transactionData: mTransaction = {
            amount: createTransactionDto.amount,
            orderChannel: createTransactionDto.orderChannel,
            description: createTransactionDto.description,
            mid: '1',
            customer: savedCustomer
        }

        console.log('ts: ', transactionData)

        const newTransaction = await this.transactionRepository.create(transactionData);
        return this.transactionRepository.save(newTransaction);
    }

    async getAllTransactions(): Promise<TransactionEntity[]>{
        return this.transactionRepository.find({
            relations: {
                customer: true
            },
        });
    }

    async getMerchantTransactions(mid: string): Promise<TransactionEntity[]>{
        return this.transactionRepository.find({
            where: {
                mid: mid
            },
            relations: {
                customer: true
            },
        });
    }

    async getTransactionById(tid: string): Promise<TransactionEntity>{
        return this.transactionRepository.findOne({
            where: {
                id: tid
            },
            relations: {
                customer: true
            },
        });
    }
}
