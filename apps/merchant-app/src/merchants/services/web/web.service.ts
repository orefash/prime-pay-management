import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Merchant } from 'apps/merchant-app/src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WebService {
    constructor
        (
            @InjectRepository(Merchant)
            private readonly merchantRepository: Repository<Merchant>,
            // @Inject(ThirdPartyDataService)
            // private readonly thirdPartDataService: ThirdPartyDataService,
            @Inject(ConfigService)
            private readonly configService: ConfigService,
            // @Inject(PaystackService)
            // private readonly paystackService: PaystackService,
        ) { }

        async getAllMerchantsLogo(): Promise<Merchant[]> {
            return this.merchantRepository.find({
                where: {
                    isActive: true,
                    isVerified: true
                },
                select: ['id', 'name', 'logoUrl', 'isActive'], // Select all fields except 'password'
                // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'promoterIdUrl', 'promoterId', 'websiteUrl', 'cacUrl', 'cacDocs', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
    
            });
        }
}
