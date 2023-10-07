import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { InjectQueue } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { KeysService } from '../../../keys/services/keys/keys.service';
import { ConfirmEmail } from '../../../mail/types/confirm_email.type';
import { CreateMerchantDto } from '../../../merchants/dto/CreateMerchant.dto';
import { MerchantsService } from '../../../merchants/services/merchants/merchants.service';
import { PaystackService } from '../../../third-party-data/services/paystack-service/paystack-service.service';
import { ThirdPartyDataService } from '../../../third-party-data/services/third-party-data/third-party-data.service';
import { Merchant, MerchantKey, ResetToken } from '../../../typeorm';
import { encodePassword } from '../../../utils/bcrypt';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class MerchantKeyCreatorService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(MerchantsService)
        private readonly merchantService: MerchantsService,
        @Inject(KeysService)
        private readonly keyService: KeysService,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        @InjectRepository(MerchantKey)
        private readonly merchantKeyRepository: Repository<MerchantKey>,
        @Inject(ThirdPartyDataService)
        private readonly thirdPartyService: ThirdPartyDataService,
        
        @Inject(PaystackService)
        private readonly paystackService: PaystackService,

        @InjectQueue('send_mail')
        private readonly mailQueue: Queue,

        @Inject(JwtService)
        private readonly jwtService: JwtService,


        @InjectRepository(ResetToken)
        private readonly tokenRepository: Repository<ResetToken>,
    ) { }

    async testMailer() {
        console.log('test mailer')
        await this.cacheManager.set("tv", 6);
        const value = await this.cacheManager.get("tv");
        if (!value) {
            console.log("not found: ", value)
            await this.cacheManager.set("tv", 4);
        } else {
            console.log("found: ", value)

        }

        const job = await this.mailQueue.add('test_mail');

        return {
            jobId: job.id
        }

    }

    async testToken(mid: string) {

        const merchant = await this.merchantRepository.findOne({
            where: {
                id: mid
            }
        });

        if (!merchant)
            throw new Error("Merchant invalid!!")


        const payload: TokenPayload = {
            merchantId: mid
        };

        const customExpirationTime = 3600; // 1 hour

        const token = this.jwtService.sign(payload, { expiresIn: customExpirationTime });

        let fToken = await this.tokenRepository.findOne({
            where: { merchant: { id: merchant.id } }
        });

        // console.log('Token: ', token)

        if (fToken) {
            await this.tokenRepository.delete(fToken.id);
        }

        const newToken = this.tokenRepository.create({ token: token, merchant });
        const createdToken = await this.tokenRepository.save(newToken);


        return {
            mid: mid,
            token: token
        }

    }

    async getTestJob(id: string) {

        const job = await this.mailQueue.getJob(id);

        return job;

    }

    async syncBankList(bankName: string) {
        const paystackBankList = await this.paystackService.getBankList();

        if(!paystackBankList)
            throw new Error("bank sync error");

        let selectedBank = paystackBankList.find(bank => bank.name.toLowerCase().includes(bankName.toLowerCase()));

        if(!selectedBank)
            throw new Error("bank sync error");

        


    }

    async createMerchantProfile(createMerchantDto: CreateMerchantDto): Promise<Merchant> {

        console.log("in register merchant")
        createMerchantDto.password = createMerchantDto.password.trim();
        createMerchantDto.email = createMerchantDto.email.trim();


        const merchant = await this.merchantRepository.findOne({
            where: {
                email: createMerchantDto.email
            }
        });

        if (merchant) throw new Error("Merchant with Email already Exists")



        const IS_TEST: string = this.configService.get<string>('IS_TEST');
        // console.log("ISTESt: ", typeof IS_TEST)

        if (IS_TEST !== "true") {
            console.log("In Acc valid check: ",)
            let isAccountValid = await this.paystackService.validateBankAccount(createMerchantDto.accountNo, createMerchantDto.bankCode);

            // console.log("Acc valid: ", isAccountValid)
            if (!isAccountValid)
                throw new Error("Invalid Bank Details!!")
        }


        let lastMid: number = await this.cacheManager.get('last_mid');

        if (!lastMid) {
            lastMid = -1;
        } else {
            lastMid = lastMid - 1;
        }

        console.log("lm: ", lastMid)
        await this.cacheManager.set('last_mid', lastMid);


        console.log("after")
        const password = encodePassword(createMerchantDto.password);
        // const newMerchant = this.merchantRepository.create({ ...createMerchantDto, password });

        const newMerchant: Merchant = new Merchant();
        // newMerchant = { ...createMerchantDto, password };


        newMerchant.systemId = lastMid;
        newMerchant.accountNo = createMerchantDto.accountNo;
        newMerchant.name = createMerchantDto.name;
        newMerchant.promoterFname = createMerchantDto.promoterFname;
        newMerchant.promoterLname = createMerchantDto.promoterLname;
        newMerchant.businessType = createMerchantDto.businessType;
        newMerchant.isRegistered = createMerchantDto.isRegistered;
        newMerchant.bvn = createMerchantDto.bvn;
        newMerchant.email = createMerchantDto.email;
        newMerchant.phone = createMerchantDto.phone;
        newMerchant.password = password;
        newMerchant.address = { country: createMerchantDto.country, no: null, lga: "", state: "", street: "" };
        newMerchant.accountNo = createMerchantDto.accountNo;
        newMerchant.bankCode = createMerchantDto.bankCode;
        newMerchant.bankName = createMerchantDto.bankName;


        //creating keys
        let createdMerchant = await this.keyService.createMerchantKey(newMerchant);
        // console.log(`createdkeys: ${JSON.stringify(createdMerchant)}`)

        const payload: TokenPayload = {
            merchantId: createdMerchant.id
        };

        const customExpirationTime = 3600; // 1 hour

        const token = this.jwtService.sign(payload, { expiresIn: customExpirationTime });

        let fToken = await this.tokenRepository.findOne({
            where: { merchant: { id: createdMerchant.id } }
        });

        // console.log('Token: ', token)

        // console.log('FToken: ', fToken)

        if (fToken) {
            await this.tokenRepository.delete(fToken.id);
        }

        const newToken = this.tokenRepository.create({ token: token, merchant: createdMerchant });
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
            name: createdMerchant.name,
            email: createdMerchant.email,
            redirect_url: bUrl
        }

        // console.log("CDATA: ", confirmEmailData)

        try {
            console.log("In email confirmation send")
            const job = await this.mailQueue.add('confirm_mail', confirmEmailData);
        } catch (error) {
            console.log("Error in email confirmation send")
        }

        delete createdMerchant.password
        return createdMerchant;
    }
}
