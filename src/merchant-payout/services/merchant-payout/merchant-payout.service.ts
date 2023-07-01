import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePayoutDto } from 'src/merchant-payout/dto/CreatePayoutTransaction.dto';
import { Merchant, MerchantPayout } from 'src/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MerchantPayoutService {

    constructor
        (
            @InjectRepository(MerchantPayout)
            private readonly payoutRepository: Repository<MerchantPayout>,
            @InjectRepository(Merchant)
            private readonly merchantRepository: Repository<Merchant>,

        ) { }


    async getPayoutList(): Promise<MerchantPayout[]> {
        return await this.payoutRepository.find();
    }

    async getPayoutListByMerchant(mid: string): Promise<MerchantPayout[]> {
        return await this.payoutRepository.find({
            where: {
                merchant: {
                    id: mid
                }
            }
        });
    }

    async addTransactionToList(transactionData: CreatePayoutDto): Promise<MerchantPayout> {
        const merchant = await this.merchantRepository.findOne({
            where: {
                id: transactionData.mid
            }
        });

        if (!merchant) {
            throw new NotFoundException(`Merchant with id ${transactionData.mid} not found`);
        }

        // if(!transactionData.isWithdraw){

        // }
        const newTransaction = await this.payoutRepository.create(transactionData);

        return this.payoutRepository.save(newTransaction);


    }
}
