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
import * as path from 'path';
import * as mime from 'mime';
import { SetMerchantIdDTO } from 'src/merchants/dto/SetMerchantIdentification.dto copy';
import { SetMerchantLogoDto } from 'src/merchants/dto/SetMerchantLogo.dto';
import { SetCACDto } from 'src/merchants/dto/SetCAC.dto';

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

    // createFileInterceptor(fieldName: string, mimeTypes: string[]) {


    // }

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

    async setMerchantIdentification(id: string, editMerchantID: SetMerchantIdDTO) {


        await this.merchantRepository.update(id, editMerchantID);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedMerchant) {
            const { password, ...merchant } = updatedMerchant;
            return {
                id: merchant.id,
                message: "Merchant Identification Set"
            };
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }


    async setMerchantLogo(id: string, setLogo: SetMerchantLogoDto) {


        await this.merchantRepository.update(id, setLogo);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedMerchant) {
            const { password, ...merchant } = updatedMerchant;
            return {
                id: merchant.id,
                message: "Merchant Logo Set"
            };
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }

    async setMerchantCAC(id: string, setCAC: SetCACDto) {


        await this.merchantRepository.update(id, setCAC);
        const updatedMerchant = await this.merchantRepository.findOne({
            where: {
                id: id
            }
        });

        if (updatedMerchant) {
            const { password, ...merchant } = updatedMerchant;
            return {
                id: merchant.id,
                message: "Merchant CAC Set"
            };
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

    async getMerchantIdentification(merchantId: string) {
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'systemId', 'promoterIdType', 'promoterId', 'promoterIdMime' ],         
        });

        // console.log('pID: ', docs);
        if(docs?.promoterId){
            
            const fileName = path.basename(docs.promoterId);
            // console.log('d: ', __dirname)
            const filePath = path.join(__dirname, '..', '..', '..', '..', 'uploads', fileName);

            const contentType = docs.promoterIdMime;
            return { fileName, contentType, filePath: filePath }
        }

        
        throw new HttpException('Merchant ID Card not found', HttpStatus.NOT_FOUND);
    }

    async getMerchantLogo(merchantId: string){
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'logoUrl', 'logoMime', 'logoPath' ], 
              
        });

        if(docs?.logoPath){
            
            const fileName = path.basename(docs.logoPath);
            // console.log('d: ', __dirname)
            const filePath = path.join(__dirname, '..', '..', '..', '..', 'uploads', fileName);

            const contentType = docs.logoMime;
            return { fileName, contentType, filePath: filePath }
        }

        
        throw new HttpException('Merchant Logo not found', HttpStatus.NOT_FOUND);

    }

    async getMerchantCAC(merchantId: string){
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'cacPath', 'cacMime'], 
              
        });

        if(docs?.cacPath){
            
            const fileName = path.basename(docs.cacPath);
            // console.log('d: ', __dirname)
            const filePath = path.join(__dirname, '..', '..', '..', '..', 'uploads', fileName);

            const contentType = docs.cacMime;
            return { fileName, contentType, filePath: filePath }
        }

        
        throw new HttpException('Merchant CAC not found', HttpStatus.NOT_FOUND);

    }


    async getMerchantByEmail(email: string): Promise<MerchantEntity> {
        return this.merchantRepository.findOne({
            where: {
                email: email
            },
            select: ['id', 'systemId', 'email', 'name', 'logoUrl', 'promoterFname', 'promoterLname', 'bvn', 'businessType', 'isRegistered', 'isActive', 'promoterIdType', 'websiteUrl', 'phone', 'address', 'avgMonthlySales', 'accountNo', 'bankCode', 'bankName', 'socials', 'regDate', 'modifiedDate', 'password'], // Select all fields except 'password'
            
        });
    }


}
