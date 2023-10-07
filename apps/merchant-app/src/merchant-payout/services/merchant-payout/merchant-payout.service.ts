import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePayoutDto, PTransactionStatus } from '../../dto/CreatePayoutTransaction.dto';
import { WithdrawPayoutDto } from '../../dto/WithdrawPayout.dto';
import { PayoutChannels } from '../../statics/PayoutChannels';
import { PaystackService } from '../../../third-party-data/services/paystack-service/paystack-service.service';
import { TransferRecipient, WithdrawResponse } from '../../../third-party-data/types/paystack-req.data';
import { Merchant, MerchantPayout } from '../../../typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MerchantPayoutService {

    constructor
        (
            @InjectRepository(MerchantPayout)
            private readonly payoutRepository: Repository<MerchantPayout>,
            @InjectRepository(Merchant)
            private readonly merchantRepository: Repository<Merchant>,
            @Inject(PaystackService)
            private readonly paystackService: PaystackService,

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

        
        if (withdrawDto.isTest) {
            throw new Error('Withdrawal Not Allowed in Test Mode');
        }

        const merchant = await this.merchantRepository.findOne({
            where: {
                id: mid
            }
        });

        // console.log("merchant: ", merchant);

        if (!merchant) {
            throw new NotFoundException(`Merchant with id ${mid} not found`);
        }

        if (merchant.availableBalance < withdrawDto.amount){
            throw new Error(`Insufficient Available Balance for Withdrawal`);
        }

        if (!merchant.recepientCode) {
            const recepientCodeData: TransferRecipient = await this.paystackService.createTransferRecipient(
                merchant.name,
                merchant.accountNo,
                merchant.bankCode,
            );

            if (!recepientCodeData.status) {
                throw new Error('Error creating Paystack Recipient code');
            }

            await this.merchantRepository.update(mid, {
                recepientCode: recepientCodeData.recipient_code,
            });

            merchant.recepientCode = recepientCodeData.recipient_code;
        }

        const withdrawPaystackResponse: WithdrawResponse = await this.paystackService.initiatePaystackTransfer(
            withdrawDto.amount,
            merchant.recepientCode,
            merchant.name,
        );

        if (!withdrawPaystackResponse.status) {
            throw new Error('Error with Paystack Withdraw');
        }

        const payout: CreatePayoutDto = {
            amount: withdrawDto.amount,
            status:
                withdrawPaystackResponse.withdraw_status === 'success'
                    ? PTransactionStatus.SUCCESS
                    : PTransactionStatus.PENDING,
            channel: PayoutChannels.PAYSTACK,
            isWithdraw: true,
            currency: 'NGN',
            mid: merchant.systemId,
            accountNo: merchant.accountNo
        };

        return this.addTransactionToList(payout);
    }


    // async withdrawFromBalance(mid: string, withdrawDto: WithdrawPayoutDto): Promise<MerchantPayout> {

    //     if(withdrawDto.isTest){
    //         throw new Error('Withdrawal Not Allowed in Test Mode')
    //     }

    //     const merchant = await this.merchantRepository.findOne({
    //         where: {
    //             id: mid
    //         }
    //     });

    //     if(!merchant){
    //         throw new NotFoundException(`Merchant with id ${mid} not found`);
    //     }

    //     if(!merchant.recepientCode){
    //         let recepientCodeData: TransferRecipient = await this.paystackService.createTransferRecipient(merchant.name, merchant.accountNo, merchant.bankCode);
    //         if(!recepientCodeData.status){
    //             throw new Error('Error creating Paystack Recepient code')
    //         }

    //         await this.merchantRepository.update(mid, {
    //             recepientCode: recepientCodeData.recipient_code
    //         });

    //         merchant.recepientCode = recepientCodeData.recipient_code;
    //     }


    //     const withdrawPaystackResponse: WithdrawResponse = await this.paystackService.initiatePaystackTransfer(withdrawDto.amount, merchant.recepientCode, merchant.name);

    //     if(!withdrawPaystackResponse.status){
    //         throw new Error('Error with Paystack Withdraw')
    //     }

    //     let payout: CreatePayoutDto = {
    //         amount: withdrawDto.amount,
    //         status: withdrawPaystackResponse.withdraw_status === "success" ? PTransactionStatus.SUCCESS : PTransactionStatus.PENDING,
    //         // status: capitalizeString(withdrawPaystackResponse.withdraw_status),
    //         channel: PayoutChannels.PAYSTACK,
    //         isWithdraw: true,
    //         currency: 'NGN',
    //         mid: merchant.systemId
    //     }


    //     return this.addTransactionToList(payout);
    // }

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

        if (transactionData.isWithdraw) {
            newActualBalance = newActualBalance - transactionData.amount;
            newAvailableBalance = newAvailableBalance - transactionData.amount;
        } else {
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
