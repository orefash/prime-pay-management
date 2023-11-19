import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgentPayout, Agent } from '../../../typeorm';
import { Repository } from 'typeorm';
import { CreatePayoutDto } from 'apps/agent-app/src/dto/CreatePayoutTransaction.dto';

@Injectable()
export class PayoutsService {
    constructor
    (
        @InjectRepository(AgentPayout)
        private readonly payoutRepository: Repository<AgentPayout>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
        // @Inject(PaystackService)
        // private readonly paystackService: PaystackService,

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


}
