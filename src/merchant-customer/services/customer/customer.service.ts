import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantCustomer } from 'src/typeorm';
import { mCustomer } from 'src/types/mCustomer.interface';
import { Repository } from 'typeorm';
import { MerchantTransaction as TransactionEntity } from 'src/typeorm';

@Injectable()
export class CustomerService {
    constructor
        (
            @InjectRepository(MerchantCustomer)
            private readonly customerRepository: Repository<MerchantCustomer>,

            @InjectRepository(TransactionEntity)
            private readonly transactionRepository: Repository<TransactionEntity>,
        ) { }

    async createCustomer(customer: mCustomer): Promise<MerchantCustomer> {
        const newCustomer = await this.customerRepository.upsert(
            customer,
            {
                conflictPaths: ["phone"],
                // skipUpdateIfNoValuesChanged: true
            }
        );
        return newCustomer.raw[0];
    };


    async getAllCustomers(): Promise<MerchantCustomer[]> {
        return this.customerRepository.find();
    };


    async getAllCustomersByMid(mid: number): Promise<MerchantCustomer[]> {

        let customerData = await this.transactionRepository
            .createQueryBuilder('merchant_transaction')
            .select('merchant_transaction.customerId', 'id')
            .addSelect('merchant_customer.name', 'name')
            .addSelect('merchant_customer.email', 'email')
            .addSelect('merchant_customer.phone', 'phone')
            .addSelect('merchant_customer.orderDate', 'orderDate')
            .leftJoin("merchant_transaction.customer", "merchant_customer")
            .distinctOn(["merchant_transaction.customerId"])
            .getRawMany();

        // console.log('Cust: ', customerData)
        return customerData;
    };


}
