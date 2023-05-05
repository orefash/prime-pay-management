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
import { UpdateMerchantBankDto } from 'src/merchants/dto/UpdateMerchantBank.dto';
import { Socials } from 'src/types/socials.interface';
import { Address } from 'src/types/address.interface';

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
        ) { }

    async createMerchant(createMerchantDto: CreateMerchantDto): Promise<MerchantEntity> {

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
        delete saved.password
        return saved;
    }

    async updateMerchantProfile(id: string, editMerchantDto: EditMerchantDto): Promise<Partial<MerchantEntity>> {

        let { facebook, twitter, instagram, street, streetNo, country, state, landmark, lga, ...updateDto} = editMerchantDto;
        let socials: Socials = {};
        if (facebook)
            socials.facebook = facebook
        if (twitter)
            socials.twitter = twitter
        if (instagram)
            socials.instagram = instagram

        updateDto.socials = socials;

        let address: Address = {
            street: street,
            no: streetNo,
            country: country,
            state: state,
            landmark: landmark,
            lga: lga
        }

        updateDto.address = address;

        await this.merchantRepository.update(id, updateDto);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedMerchant) {
            const { password, ...merchant } = updatedMerchant;
            return merchant;
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    async updateMerchantBank(id: string, editMerchantBankDto: UpdateMerchantBankDto): Promise<Partial<MerchantEntity>> {

        await this.merchantRepository.update(id, editMerchantBankDto);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });
        if (updatedMerchant) {
            const { password, ...merchant } = updatedMerchant;
            return merchant;
        }
        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    //if merchant with ID exists, create merchant on the core banking and update the mid and active status
    async setMerchantActive(id: string): Promise<Partial<MerchantEntity>> {

        const fetchedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });

        console.log('Fetched Merchant: ', fetchedMerchant);

        if (fetchedMerchant) {

            let PPAY_STATUS = this.configService.get<number>('PPAY');

            console.log("in merchant activate pp", PPAY_STATUS)

            let mid = 11;

            if (PPAY_STATUS == 0) {
                let regMerchantData: RegisterMerchantDto = {
                    name: fetchedMerchant.name,
                    accountNo: fetchedMerchant.accountNo,
                    bankCode: fetchedMerchant.bankCode
                }
                const merchantId = await this.thirdPartDataService.registerMerchant(regMerchantData);

                mid = merchantId;
            }

            await this.merchantRepository.update(id, {
                isActive: true,
                systemId: mid
            });

            const updatedMerchant = await this.merchantRepository.findOne({
                where: {
                    id: id
                }
            });

            if (updatedMerchant) {
                const { password, ...merchant } = updatedMerchant;
                return merchant;
            };
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    async getAllMerchants(): Promise<MerchantEntity[]> {
        return this.merchantRepository.find({
            select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
            // select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'promoterIdUrl', 'promoterId', 'websiteUrl', 'cacUrl', 'cacDocs', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
              
        });
    }

    async getMerchantById(merchantId: string): Promise<MerchantEntity> {
        return this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
              
        });
    }

    async getMerchantByEmail(email: string): Promise<MerchantEntity> {
        return this.merchantRepository.findOne({
            where: {
                email: email
            },
            select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate'], // Select all fields except 'password'
            
        });
    }


}
