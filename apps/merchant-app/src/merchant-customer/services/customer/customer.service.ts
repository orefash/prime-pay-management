import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantCustomer } from '../../../typeorm';
import { mCustomer } from '../../../types/mCustomer.interface';
import { Repository } from 'typeorm';
import { MerchantTransaction as TransactionEntity } from '../../../typeorm';

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


    async getAllCustomersByMid(mid: string, isTest: boolean, searchQuery: string, pageNo: number, itemLimit: number, startDate: string, endDate: string): Promise<MerchantCustomer[]> {

        let customerData = this.transactionRepository
            .createQueryBuilder('merchant_transaction')
            .select('merchant_transaction.customerId', 'id')
            .addSelect('merchant_customer.name', 'name')
            .addSelect('merchant_customer.email', 'email')
            .addSelect('merchant_customer.phone', 'phone')
            .addSelect('merchant_customer.orderDate', 'orderDate')
            .where("merchant_transaction.merchantId = :mid", { mid: mid })
            .andWhere("merchant_transaction.isTest = :isTest", { isTest: isTest })
            .leftJoin("merchant_transaction.customer", "merchant_customer");

        if (searchQuery) {
            customerData.andWhere("merchant_customer.name ILIKE :name", { name: `%${searchQuery}%` })
                .orWhere("merchant_customer.phone ILIKE :phone", { phone: `%${searchQuery}%` })
                .orWhere("merchant_customer.email ILIKE :email", { email: `%${searchQuery}%` });
        }

        if (startDate && endDate) {
            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            customerData.andWhere("merchant_transaction.orderDate BETWEEN :startDate AND :endDate", {
                startDate: startDateObject,
                endDate: endDateObject,
            });
        } else if (startDate) {
            // Only startDate is provided
            console.log("Only startDate is provided")
            const startDateObject = new Date(startDate);
            customerData.andWhere("merchant_transaction.orderDate >= :startDate", {
                startDate: startDateObject,
            });
        } else if (endDate) {
            // Only endDate is provided
            const endDateObject = new Date(endDate);
            customerData.andWhere("merchant_transaction.orderDate <= :endDate", {
                endDate: endDateObject,
            });
        }

        customerData.distinctOn(["merchant_transaction.customerId"]);

        // if (itemLimit && pageNo) {
        //     // Calculate the total count of customers before applying pagination
        //     const totalCount = await customerData.getCount();

        //     console.log('cnt: ', totalCount)

        //     // Calculate the total number of pages based on the total count and the item limit
        //     const totalPages = Math.ceil(totalCount / itemLimit);
        // }

        // customerData = customerData.asQueryBuilder();




        if (pageNo && itemLimit) {
            console.log("in paginate")
            const skipValue = (pageNo - 1) * itemLimit;
            customerData = customerData.skip(skipValue).take(itemLimit);
        }

        // console.log('Cust: ', customerData)
        return customerData.getRawMany();
    };


}
