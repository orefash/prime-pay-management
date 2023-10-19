import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SetAgentIdentificationDto } from 'apps/agent-app/src/dto/SetAgentIdentification.dto';
import { SetAgentLogoDto } from 'apps/agent-app/src/dto/SetAgentLogo.dto';
import { Agent, ResetToken } from 'apps/agent-app/src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
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

        async setAgentLogo(id: string, setLogo: SetAgentLogoDto) {
            await this.agentRepository.update(id, setLogo);
            const updatedAgent = await this.agentRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (updatedAgent) {
                const { password, ...agent } = updatedAgent;
                return {
                    id: agent.id,
                    message: "Agent Logo Set"
                };
            }
    
            throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
        }
        
    
        async setAgentIdentification(id: string, editAgentID: SetAgentIdentificationDto) {
    
            await this.agentRepository.update(id, editAgentID);
            const updatedAgent = await this.agentRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (updatedAgent) {
                const { password, ...agent } = updatedAgent;
                return {
                    id: updatedAgent.id,
                    idType: updatedAgent.IdType,
                    message: "AGent Identification Set"
                };
            }
    
            throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
        }


    
}
