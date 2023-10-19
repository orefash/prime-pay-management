import { MerchantCustomer } from '@app/db-lib/models/MerchantCustomer';
import { MerchantTransaction } from '@app/db-lib/models/MerchantTransaction';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
    constructor
    (
        @InjectRepository(MerchantCustomer)
        private readonly customerRepository: Repository<MerchantCustomer>,

        @InjectRepository(MerchantTransaction)
        private readonly transactionRepository: Repository<MerchantTransaction>,
    ) { }

    // async getAllCustomers(): Promise<MerchantCustomer[]> {
    //     return this.customerRepository.find();
    // };


    async getAllCustomersByAgentCode(agentCode: string, searchQuery: string, pageNo: number, itemLimit: number, startDate: string, endDate: string): Promise<MerchantCustomer[]> {

        let customerData = this.transactionRepository
            .createQueryBuilder('merchant_transaction')
            .select('merchant_transaction.customerId', 'id')
            .addSelect('merchant_customer.name', 'name')
            .addSelect('merchant_customer.email', 'email')
            .addSelect('merchant_customer.phone', 'phone')
            .addSelect('merchant_customer.orderDate', 'orderDate')
            .where("merchant_transaction.agentCode = :agentCode", { agentCode: agentCode })
            .andWhere("merchant_transaction.isTest = :isTest", { isTest: false })
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
