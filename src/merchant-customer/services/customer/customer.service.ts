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


    async getAllCustomersByMid(mid: number, isTest: boolean, searchQuery = null): Promise<MerchantCustomer[]> {

        let customerData = this.transactionRepository
            .createQueryBuilder('merchant_transaction')
            .select('merchant_transaction.customerId', 'id')
            .addSelect('merchant_customer.name', 'name')
            .addSelect('merchant_customer.email', 'email')
            .addSelect('merchant_customer.phone', 'phone')
            .addSelect('merchant_customer.orderDate', 'orderDate')
            .where("merchant_transaction.mid = :mid", { mid: mid })
            .andWhere("merchant_transaction.isTest = :isTest", { isTest: isTest })
            .leftJoin("merchant_transaction.customer", "merchant_customer");

        if (searchQuery) {
            customerData.andWhere("merchant_customer.name ILIKE :name", { name: `%${searchQuery}%` })
                .orWhere("merchant_customer.phone ILIKE :phone", { phone: `%${searchQuery}%` })
                .orWhere("merchant_customer.email ILIKE :email", { email: `%${searchQuery}%` });
        }

        customerData.distinctOn(["merchant_transaction.customerId"]);

        // console.log('Cust: ', customerData)
        return customerData.getRawMany();
    };


}
