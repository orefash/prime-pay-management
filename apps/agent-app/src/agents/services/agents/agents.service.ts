import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../../../typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateAgentDto } from '../../../dto/CreateAgent.dto';
import { encodePassword } from '@app/utils/utils/bcrypt';
import { TokenPayload } from '../../../auth/types/tokenPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { ResetToken } from '../../../typeorm/ResetToken';
import { ConfirmEmail } from '@app/db-lib/types/confirm_email.type';

@Injectable()
export class AgentsService {
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

    async createAgentProfile(createAgentDto: CreateAgentDto): Promise<Agent> {

        console.log("in register agent")
        createAgentDto.password = createAgentDto.password.trim();
        createAgentDto.email = createAgentDto.email.trim();


        const agent = await this.agentRepository.findOne({
            where: {
                email: createAgentDto.email
            }
        });

        if (agent) throw new Error("Agent with Email already Exists")



        const IS_TEST: string = this.configService.get<string>('IS_TEST');
        // console.log("ISTESt: ", typeof IS_TEST)

        // if (IS_TEST !== "true") {
        //     console.log("In Acc valid check: ",)
        //     let isAccountValid = await this.paystackService.validateBankAccount(createAgentDto.accountNo, createAgentDto.bankCode);

        //     // console.log("Acc valid: ", isAccountValid)
        //     if (!isAccountValid)
        //         throw new Error("Invalid Bank Details!!")
        // }


        // let lastMid: number = await this.cacheManager.get('last_mid');

        // if (!lastMid) {
        //     lastMid = -1;
        // } else {
        //     lastMid = lastMid - 1;
        // }

        // console.log("lm: ", lastMid)
        // await this.cacheManager.set('last_mid', lastMid);


        console.log("after")
        const password = encodePassword(createAgentDto.password);
        // const newAgent = this.merchantRepository.create({ ...createAgentDto, password });

        const newAgent: Agent = new Agent();
        // newAgent = { ...createAgentDto, password };


        // newAgent.systemId = lastMid;
        newAgent.accountNo = createAgentDto.accountNo;
        newAgent.agentFname = createAgentDto.agentFname;
        newAgent.agentLname = createAgentDto.agentLname;
        newAgent.marketSector = createAgentDto.marketSector;
        // newAgent.isRegistered = createAgentDto.isRegistered;
        newAgent.bvn = createAgentDto.bvn;
        newAgent.email = createAgentDto.email;
        newAgent.phone = createAgentDto.phone;
        newAgent.password = password;
        newAgent.address = { country: createAgentDto.country, no: null, lga: "", state: "", street: "" };
        newAgent.accountNo = createAgentDto.accountNo;
        newAgent.bankCode = createAgentDto.bankCode;
        newAgent.bankName = createAgentDto.bankName;
        newAgent.agentCode = "agent"


        //creating keys
        // let createdMerchant = await this.keyService.createMerchantKey(newAgent);
        // console.log(`createdkeys: ${JSON.stringify(createdMerchant)}`)

        let createdAgent = await this.agentRepository.save(newAgent);

        const payload: TokenPayload = {
            uid: createdAgent.id
        };

        const customExpirationTime = 3600; // 1 hour

        const token = this.jwtService.sign(payload, { expiresIn: customExpirationTime });

        let fToken = await this.tokenRepository.findOne({
            where: { agent: { id: createdAgent.id } }
        });

        // console.log('Token: ', token)

        // console.log('FToken: ', fToken)

        if (fToken) {
            await this.tokenRepository.delete(fToken.id);
        }

        const newToken = this.tokenRepository.create({ token: token, agent: createdAgent });
        const createdToken = await this.tokenRepository.save(newToken);

        const isLocal = this.configService.get<number>('IS_LOCAL');

        let bUrl = "";
        if (isLocal == 1) {
            bUrl = this.configService.get<string>('API_URL_TEST')
        } else {
            bUrl = this.configService.get<string>('API_URL_LIVE')
        }

        bUrl = `${bUrl}/api/auth/merchant/confirm/${token}`

        let confirmEmailData: ConfirmEmail = {
            name: createdAgent.agentFname + " " + createdAgent.agentLname,
            email: createdAgent.email,
            redirect_url: bUrl
        }

        // console.log("CDATA: ", confirmEmailData)

        // try {
        //     console.log("In email confirmation send")
        //     const job = await this.mailQueue.add('confirm_mail', confirmEmailData);
        // } catch (error) {
        //     console.log("Error in email confirmation send")
        // }

        delete createdAgent.password
        return createdAgent;
    }

    async getAgentByField(field: string, value: string): Promise<Agent> {
        try {
            return this.agentRepository.findOne({
                where: {
                    [field]: value
                },
                // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'

            });
        } catch (error) {
            throw error;
        }

    }


    async getAllAgents(): Promise<Agent[]> {
        try {
            return this.agentRepository.find({
                
                // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'

            });
        } catch (error) {
            throw error;
        }

    }
}