import {  HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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
import { UpdateBankDto } from '@app/db-lib/dto/UpdateBankDetails.dto';
import { SetAgentLogoDto } from 'apps/agent-app/src/dto/SetAgentLogo.dto';
import { SetAgentIdentificationDto } from 'apps/agent-app/src/dto/SetAgentIdentification.dto';
import { EditAgentDto } from 'apps/agent-app/src/dto/EditAgent.dto';
import { Address } from '@app/db-lib/types/address.interface';

import { Cache } from 'cache-manager';

@Injectable()
export class AgentsService {
    constructor
        (

            @Inject(CACHE_MANAGER) private cacheManager: Cache,
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


        let lastMid: number = await this.cacheManager.get('last_acode');


        // console.log("fetch lm: ", lastMid)

        if (!lastMid) {
            lastMid = -1;
        } else {
            lastMid = lastMid - 1;
        }

        // console.log("before set lm: ", lastMid)
        await this.cacheManager.set('last_acode', lastMid);


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
        newAgent.stateOfOrigin = createAgentDto.stateOfOrigin;
        // newAgent.isRegistered = createAgentDto.isRegistered;
        newAgent.bvn = createAgentDto.bvn;
        newAgent.email = createAgentDto.email;
        newAgent.phone = createAgentDto.phone;
        newAgent.password = password;
        newAgent.address = { country: createAgentDto.country, lga: "", state: "", street: "" };
        newAgent.accountNo = createAgentDto.accountNo;
        newAgent.bankCode = createAgentDto.bankCode;
        newAgent.bankName = createAgentDto.bankName;
        newAgent.agentCode = lastMid+"";


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

    async updateAgentProfile(id: string, editAgentDto: EditAgentDto): Promise<Partial<Agent>> {
        try {
            console.log("in edit");
            let { street, country, state, landmark, lga, ...updateDto } = editAgentDto;
    
            let address: Address = {
                street: street,
                // no: streetNo,
                country: country,
                state: state,
                landmark: landmark,
                lga: lga
            }
    
            updateDto.address = address;
    
            await this.agentRepository.update(id, updateDto);
            const updatedAgent = await this.agentRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (updatedAgent) {
                console.log('Updated: ', updatedAgent)
                const { password, ...agent } = updatedAgent;
                return agent;
            }
    
            throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            // Handle the exception here (e.g., log the error, send a custom error response)
            console.error('Error occurred while updating agent profile:', error);
            console.error('Error occurred while updating agent profile:', error.detail);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    async getAgentByField(field: string, value: string): Promise<Agent> {
        try {

            let agent = await this.agentRepository.findOne({
                where: {
                    [field]: value
                },
                // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'

            });

            // if (agent)
            //     delete agent.password;

            return agent;

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

    async getAgentBalance(id: string): Promise<Agent> {

        let agents = await this.agentRepository.createQueryBuilder('m')
            .select(['m.id', 'm.agentCode', 'm.availableBalance'])
            .where("id = :id", { id })
            .getOne();

        if (!agents)
            throw new Error("Invalid AGent ID")

        delete agents.password;

        return agents;
    }


    async updateAgentBank(id: string, editBankDto: UpdateBankDto): Promise<Partial<Agent>> {
        try {
            // Validate the bank account using thirdPartDataService.
            let IS_TEST = this.configService.get<boolean>('IS_TEST');

            // if (!IS_TEST) {
            //     const isAccountValid = await this.paystackService.validateBankAccount(editMerchantBankDto.accountNo, editMerchantBankDto.bankCode);

            //     if (!isAccountValid) {
            //         throw new BadRequestException('Invalid Bank Details!!');
            //     }
            // }


            // Perform the update in the database.
            await this.agentRepository.update(id, editBankDto);

            // Fetch the updated merchant record from the database.
            const updatedAgent = await this.agentRepository.findOne({
                where: { id: id }
            });

            if (updatedAgent) {
                // Remove the password field from the result before returning.
                const { password, ...agent } = updatedAgent;
                return agent;
            }

            throw new HttpException('Agent not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }





}
