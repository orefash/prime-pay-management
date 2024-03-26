import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyDataService } from '../../../third-party-data/services/third-party-data/third-party-data.service';
import { Repository } from 'typeorm';

import { Merchant as MerchantEntity } from '../../../typeorm';
import { ConfigService } from '@nestjs/config';
import { PaystackService } from '../../../third-party-data/services/paystack-service/paystack-service.service';
import { UpdateMerchantMIDDto } from '../../dto/UpdateMerchantMID.dto';

@Injectable()
export class SuperAdminService {
    constructor
        (
            @InjectRepository(MerchantEntity)
            private readonly merchantRepository: Repository<MerchantEntity>,
            @Inject(ThirdPartyDataService)
            private readonly thirdPartDataService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService,
            @Inject(PaystackService)
            private readonly paystackService: PaystackService,
        ) { }

        async setMerchantConfirmed(id: string) {

            await this.merchantRepository.update(id, {
                isConfirmed: true
            });
            const updatedMerchant = await this.merchantRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (updatedMerchant) {
                const { password, ...merchant } = updatedMerchant;
                return {
                    id: merchant.id,
                    message: "Merchant Confirmed"
                };
            }
    
            throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
        }


        async setMerchantMID(id: string, setMID: UpdateMerchantMIDDto) {

            await this.merchantRepository.update(id, setMID);
    
            const updatedMerchant = await this.merchantRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (updatedMerchant) {
                const { password, ...merchant } = updatedMerchant;
                return {
                    id: merchant.id,
                    merchant: merchant,
                    message: "Merchant MID Set"
                };
            }
    
            throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
        }

        async getAllMerchants(): Promise<MerchantEntity[]> {
            return this.merchantRepository.find({
                select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'idDocuments', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
                // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'promoterIdUrl', 'promoterId', 'websiteUrl', 'cacUrl', 'cacDocs', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
    
            });
        }
}
