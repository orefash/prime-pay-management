import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { KeysService } from 'src/keys/services/keys/keys.service';
import { CreateMerchantDto } from 'src/merchants/dto/CreateMerchant.dto';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { Merchant } from 'src/typeorm';
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

        let PPAY_STATUS = this.configService.get<number>('PPAY');


        const password = encodePassword(createMerchantDto.password);
        const newMerchant = this.merchantRepository.create({ ...createMerchantDto, password });
        let saved = await this.merchantRepository.save(newMerchant);

        //creating keys
        let createdKeys = await this.keyService.create(saved);
        // console.log(`createdkeys: ${JSON.stringify(createdKeys)}`)

        delete saved.password
        return saved;
    }
}
