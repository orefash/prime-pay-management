import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantCustomer } from 'src/typeorm';
import { mCustomer } from 'src/types/mCustomer.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
    constructor
    (
        @InjectRepository(MerchantCustomer)
        private readonly customerRepository: Repository<MerchantCustomer>
    ){}

    async createCustomer(customer: mCustomer): Promise<MerchantCustomer>{
        const newCustomer = await this.customerRepository.upsert(
            customer,
            {
                conflictPaths: ["phone"],
                // skipUpdateIfNoValuesChanged: true
            }   
        );
        return newCustomer.raw[0];
    };


    async getAllCustomers(): Promise<MerchantCustomer[]>{
        return this.customerRepository.find();
    };


}
