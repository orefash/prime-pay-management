import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAgentCodeDto } from 'apps/agent-app/src/dto/UpdateAgentCode.dto';
import { Agent, ResetToken } from 'apps/agent-app/src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor
        (
            @InjectRepository(Agent)
            private readonly agentRepository: Repository<Agent>,
            // @Inject(ThirdPartyDataService)
            // private readonly thirdPartDataService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService,
            @Inject(JwtService)
            private readonly jwtService: JwtService,
            @InjectRepository(ResetToken)
            private readonly tokenRepository: Repository<ResetToken>,
            // @Inject(PaystackService)
            // private readonly paystackService: PaystackService,
        ) { }

    //if merchant with ID exists, create merchant on the core banking and update the mid and active status
    async verifyAgent(id: string): Promise<Partial<Agent>> {

        const fetchedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        // console.log('Fetched Merchant: ', fetchedMerchant);

        if (fetchedAgent) {
            // note : review paystack and bank

            let PPAY_STATUS = this.configService.get<number>('PPAY');

            console.log("in agent activate pp", PPAY_STATUS)

            let mid = null;

            // if (PPAY_STATUS == 0) {
            //     let regMerchantData: RegisterMerchantDto = {
            //         name: fetchedMerchant.name,
            //         accountNo: fetchedMerchant.accountNo,
            //         bankCode: fetchedMerchant.bankCode
            //     }
            //     const merchantId = await this.thirdPartDataService.registerMerchant(regMerchantData);

            //     console.log("from ppay: ", merchantId)

            //     mid = merchantId;
            // }

            await this.agentRepository.update(id, {
                isActive: true,
                isVerified: true,
                // systemId: mid
            });

            const updatedAgent = await this.agentRepository.findOne({
                where: {
                    id: id
                }
            });

            if (updatedAgent) {
                const { password, ...agent } = updatedAgent;
                return agent;
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }


    async toggleAgentActive(id: string): Promise<Partial<Agent>> {

        const fetchedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        // console.log('Fetched Merchant: ', fetchedMerchant);

        if (fetchedAgent) {



            await this.agentRepository.update(id, {
                isActive: !fetchedAgent.isActive,

            });

            const updatedAgent = await this.agentRepository.findOne({
                where: {
                    id: id
                }
            });

            if (updatedAgent) {
                const { password, ...agent } = updatedAgent;
                return agent;
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }

    async setAgentConfirmed(id: string) {

        await this.agentRepository.update(id, {
            isConfirmed: true
        });
        const updatedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedAgent) {
            const { password, ...agent } = updatedAgent;
            return {
                id: agent.id,
                message: "Agent Confirmed"
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }


    async setAgentCode(id: string, setAgentCode: UpdateAgentCodeDto) {

        await this.agentRepository.update(id, setAgentCode);

        const updatedAgent = await this.agentRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedAgent) {
            const { password, ...agent } = updatedAgent;
            return {
                id: agent.id,
                agent: agent,
                message: "Agent Code Set"
            };
        }

        throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
    }

}
