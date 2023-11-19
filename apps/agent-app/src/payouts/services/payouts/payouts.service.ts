import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentPayout, Agent } from '../../../typeorm';
import { Repository } from 'typeorm';
import { CreatePayoutDto, PTransactionStatus } from 'apps/agent-app/src/dto/CreatePayoutTransaction.dto';
import { WithdrawPayoutDto } from 'apps/agent-app/src/dto/WithdrawPayout.dto';
import { PaystackLibService } from '@app/paystack-lib';
import { TransferRecipient, WithdrawResponse } from '@app/db-lib/types/paystack-req.data';
import { PayoutChannels } from '@app/db-lib/statics/PayoutChannels';
import { PaystackService } from 'apps/agent-app/src/external-apis/services/paystack/paystack.service';

@Injectable()
export class PayoutsService {
    constructor
    (
        @InjectRepository(AgentPayout)
        private readonly payoutRepository: Repository<AgentPayout>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        @Inject(PaystackService)
        private readonly paystackService: PaystackService,

    ) { }

    async getPayoutList(): Promise<AgentPayout[]> {
        return await this.payoutRepository.find();
    }

    async getPayoutListByAgent(id: string): Promise<AgentPayout[]> {
        return await this.payoutRepository.find({
            where: {
                agent: {
                    id: id
                }
            }
        });
    }


    async addTransactionToList(transactionData: CreatePayoutDto): Promise<AgentPayout> {
        const agent = await this.agentRepository.findOne({
            where: {
                id: transactionData.id
            }
        });

        if (!agent) {
            throw new NotFoundException(`Agent with id ${transactionData.id} not found`);
        }

        let newAvailableBalance = agent.availableBalance;

        if (transactionData.isWithdraw) {
            newAvailableBalance = newAvailableBalance - transactionData.amount;

        } else {
            newAvailableBalance = newAvailableBalance + transactionData.amount;
        }

        if(newAvailableBalance < 0)
            throw new Error("Invalid Withdrawal: Insufficient Balance")

        await this.agentRepository.update(agent.id, {
            availableBalance: newAvailableBalance,
        });

        const newTransaction = await this.payoutRepository.create(transactionData);

        return this.payoutRepository.save(newTransaction);

    }


    async withdrawFromBalance(mid: string, withdrawDto: WithdrawPayoutDto): Promise<AgentPayout> {

        
        if (withdrawDto.isTest) {
            throw new Error('Withdrawal Not Allowed in Test Mode');
        }

        const agent = await this.agentRepository.findOne({
            where: {
                id: mid
            }
        });


        if (!agent) {
            throw new NotFoundException(`Agent with id ${mid} not found`);
        }

        console.log("Agent: ", agent)

        if (agent.availableBalance < withdrawDto.amount){
            throw new Error(`Insufficient Available Balance for Withdrawal`);
        }

        if (!agent.recepientCode) {
            const recepientCodeData: TransferRecipient = await this.paystackService.createTransferRecipient(
                agent.agentFname+ " " + agent.agentLname,
                agent.accountNo,
                agent.bankCode,
            );

            if (!recepientCodeData.status) {
                throw new Error(recepientCodeData.message);
            }

            await this.agentRepository.update(mid, {
                recepientCode: recepientCodeData.recipient_code,
            });

            agent.recepientCode = recepientCodeData.recipient_code;
        }

        const withdrawPaystackResponse: WithdrawResponse = await this.paystackService.initiatePaystackTransfer(
            withdrawDto.amount,
            agent.recepientCode,
            agent.agentFname + " " + agent.agentLname,
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
            id: agent.id,
            accountNo: agent.accountNo
        };

        return this.addTransactionToList(payout);
    }


}
