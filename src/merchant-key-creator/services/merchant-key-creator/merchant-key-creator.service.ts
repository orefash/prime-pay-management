import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { KeysService } from 'src/keys/services/keys/keys.service';
import { CreateMerchantDto } from 'src/merchants/dto/CreateMerchant.dto';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant, MerchantKey } from 'src/typeorm';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class MerchantKeyCreatorService {
    constructor(
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
    ) { }

    async createMerchantProfile(createMerchantDto: CreateMerchantDto): Promise<Merchant> {

        // console.log(`Merchant: ${JSON.stringify(createMerchantDto)}`);

        createMerchantDto.password = createMerchantDto.password.trim();
        createMerchantDto.email = createMerchantDto.email.trim();


        const merchant = await this.merchantRepository.findOne({
            where: {
                email: createMerchantDto.email
            }
        });

        if (merchant) throw new Error("Merchant with Email already Exists")

        // let PPAY_STATUS = this.configService.get<number>('PPAY');


        const password = encodePassword(createMerchantDto.password);
        // const newMerchant = this.merchantRepository.create({ ...createMerchantDto, password });

        const newMerchant: Merchant = new Merchant();
        // newMerchant = { ...createMerchantDto, password };

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
        newMerchant.address = { country: createMerchantDto.country , no: null, lga: "", state: "", street: "" };
        newMerchant.accountNo = createMerchantDto.accountNo;
        newMerchant.bankCode = createMerchantDto.bankCode;
        newMerchant.bankName = createMerchantDto.bankName;

        // const key: MerchantKey = new MerchantKey();



        

        // let saved = await this.merchantRepository.save(newMerchant);

        console.log("nm: ", newMerchant);

        //creating keys
        let createdMerchant = await this.keyService.createMerchantKey(newMerchant);
        // console.log(`createdkeys: ${JSON.stringify(createdKeys)}`)

        delete createdMerchant.password
        return createdMerchant;
    }
}
