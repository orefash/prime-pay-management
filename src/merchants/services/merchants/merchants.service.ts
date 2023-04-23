import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMerchantDto } from '../../dto/CreateMerchant.dto';
import { Merchant as MerchantEntity } from 'src/typeorm';
import { encodePassword } from '../../../utils/bcrypt';
import { Repository } from 'typeorm';
import { EditMerchantDto } from 'src/merchants/dto/UpdateMerchant.dto';
import { ThirdPartyDataService } from 'src/third-party-data/services/third-party-data/third-party-data.service';
import { RegisterMerchantDto } from 'src/third-party-data/dto/RegisterMerchant.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MerchantsService {

    constructor
    (
        @InjectRepository(MerchantEntity)
        private readonly merchantRepository: Repository<MerchantEntity>,
        @Inject(ThirdPartyDataService)
        private readonly thirdPartDataService: ThirdPartyDataService,
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ){}

    async createMerchant(createMerchantDto: CreateMerchantDto): Promise<MerchantEntity>{
        
        const merchant = await this.merchantRepository.findOne({
            where: {
                email: createMerchantDto.email
            }
        });

        if(merchant) throw new Error ("Merchant with Email already Exists")

        let PPAY_STATUS = this.configService.get<number>('PPAY');

        console.log("pp", PPAY_STATUS)

        if(PPAY_STATUS == 0){
            const merchantId = await this.thirdPartDataService.registerMerchant(createMerchantDto);

            createMerchantDto.systemId = merchantId;
        }else{
            createMerchantDto.systemId = 11;
        }

        
        
        const password =  encodePassword(createMerchantDto.password);
        const newMerchant = this.merchantRepository.create({ ...createMerchantDto, password });
        return this.merchantRepository.save(newMerchant);
    }

    async updateMerchantProfile(id: string, editMerchantDto: EditMerchantDto): Promise<MerchantEntity> {
        await this.merchantRepository.update(id, editMerchantDto);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });
        if (updatedMerchant) {
          return updatedMerchant
        }
        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    async getAllMerchants(): Promise<MerchantEntity[]>{
        return this.merchantRepository.find();
    }

    async getMerchantById(merchantId: string): Promise<MerchantEntity>{
        return this.merchantRepository.findOne({
            where: {
                id: merchantId
            }
        });
    }

    async getMerchantByEmail(email: string): Promise<MerchantEntity>{
        return this.merchantRepository.findOne({
            where: {
                email: email
            }
        });
    }


}
