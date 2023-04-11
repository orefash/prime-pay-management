import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMerchantDto } from 'src/merchants/dto/CreateMErchant.dto';
import { Merchant as MerchantEntity } from 'src/typeorm';
import { encodePassword } from '../../../utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class MerchantsService {

    constructor
    (
        @InjectRepository(MerchantEntity)
        private readonly merchantRepository: Repository<MerchantEntity>
    ){}

    async createMerchant(createMerchantDto: CreateMerchantDto): Promise<MerchantEntity>{
        const password =  encodePassword(createMerchantDto.password);
        const newMerchant = this.merchantRepository.create({ ...createMerchantDto, password });
        return this.merchantRepository.save(newMerchant);
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
