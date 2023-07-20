import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePayoutDto, PTransactionStatus } from 'src/merchant-payout/dto/CreatePayoutTransaction.dto';
import { WithdrawPayoutDto } from 'src/merchant-payout/dto/WithdrawPayout.dto';
import { PayoutChannels } from 'src/merchant-payout/statics/PayoutChannels';
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

    async getPayoutListByMerchant(mid: number): Promise<MerchantPayout[]> {
        return await this.payoutRepository.find({
            where: {
                merchant: {
                    systemId: mid
                }
            }
        });
    }

    async withdrawFromBalance(mid: string, withdrawDto: WithdrawPayoutDto): Promise<MerchantPayout> {


        let payout: CreatePayoutDto = {
            amount: withdrawDto.amount,
            status: PTransactionStatus.COMPLETED,
            channel: PayoutChannels.WITHDRAW,
            isWithdraw: true,
            currency: 'NGN',
            mid: 133
        }


        return this.addTransactionToList(payout);
    }

    async addTransactionToList(transactionData: CreatePayoutDto): Promise<MerchantPayout> {
        const merchant = await this.merchantRepository.findOne({
            where: {
                systemId: transactionData.mid
            }
        });

        if (!merchant) {
            throw new NotFoundException(`Merchant with id ${transactionData.mid} not found`);
        }

        let newAvailableBalance = merchant.availableBalance;
        let newActualBalance = merchant.actualBalance;

        if(transactionData.isWithdraw){
            newActualBalance = newActualBalance - transactionData.amount;
            newAvailableBalance = newAvailableBalance - transactionData.amount;
        }else{
            newAvailableBalance = newAvailableBalance + transactionData.amount;
        }

        await this.merchantRepository.update(merchant.id, {
            availableBalance: newAvailableBalance,
            actualBalance: newActualBalance
        });

        // if(!transactionData.isWithdraw){

        // }

        const newTransaction = await this.payoutRepository.create(transactionData);

        return this.payoutRepository.save(newTransaction);

    }
}
