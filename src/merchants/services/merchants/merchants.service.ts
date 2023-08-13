import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
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
import { CACDocType, updateMerchantCACDocDTO } from 'src/merchants/dto/SetCAC.dto';
import { KeysService } from 'src/keys/services/keys/keys.service';
import { PaystackService } from 'src/third-party-data/services/paystack-service/paystack-service.service';
import { LoadImageUrl } from 'src/types/image.url.interface';
import { UpdateMerchantMIDDto } from 'src/merchants/dto/UpdateMerchantMID.dto';

@Injectable()
export class MerchantsService {

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


    async updateMerchantProfile(id: string, editMerchantDto: EditMerchantDto): Promise<Partial<MerchantEntity>> {

        let { facebook, twitter, instagram, street, streetNo, country, state, landmark, lga, ...updateDto } = editMerchantDto;
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
            console.log('Updated: ', updatedMerchant)
            const { password, ...merchant } = updatedMerchant;
            return merchant;
        }

        throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
    }


    async updateMerchantSystemId(id: string, systemId: number): Promise<Partial<MerchantEntity>> {

        await this.merchantRepository.update(id, {
            systemId
        });

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
                idType: merchant.promoterIdType,
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

    async setMerchantCAC(id: string, setCAC: CACDocType) {


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

    async setMerchantCACDocs(setCACDocs: updateMerchantCACDocDTO, baseUrl: string) {

        // await this.merchantRepository.update(id, setCAC);
        const merchant = await this.merchantRepository.findOne({
            where: {
                id: setCACDocs.merchantID
            }
        });

        if (!merchant)
            throw new Error(`Merchant with id ${setCACDocs.merchantID} not found!!`);


        if (setCACDocs.existingDocString && merchant.cacDocuments && merchant.cacDocuments.length > 0) {
            let exsitingDocs: CACDocType[] = JSON.parse(setCACDocs.existingDocString);

            merchant.cacDocuments = merchant.cacDocuments.filter((object) =>
                exsitingDocs.some((otherObject) => otherObject.name === object.name)
            );

            setCACDocs.docs = merchant.cacDocuments.concat(setCACDocs.docs);
        }

        merchant.cacDocuments = setCACDocs.docs;

        const updatedCACDocuments = merchant.cacDocuments.map((doc) => ({
            ...doc,
            docUrl: doc.docUrl.includes('http') ? doc.docUrl : baseUrl + doc.docUrl,
        }));

        merchant.cacDocuments = updatedCACDocuments;

        let updatedMerchant = await this.merchantRepository.save(merchant);

        return {
            id: updatedMerchant.id,
            cacDocuments: updatedMerchant.cacDocuments
        }
    }

    async updateMerchantBank(id: string, editMerchantBankDto: UpdateMerchantBankDto): Promise<Partial<MerchantEntity>> {
        try {
            // Validate the bank account using thirdPartDataService.
            let IS_TEST = this.configService.get<boolean>('IS_TEST');

            if (!IS_TEST) {
                const isAccountValid = await this.paystackService.validateBankAccount(editMerchantBankDto.accountNo, editMerchantBankDto.bankCode);

                if (!isAccountValid) {
                    throw new BadRequestException('Invalid Bank Details!!');
                }
            }


            // Perform the update in the database.
            await this.merchantRepository.update(id, editMerchantBankDto);

            // Fetch the updated merchant record from the database.
            const updatedMerchant = await this.merchantRepository.findOne({
                where: { id: id }
            });

            if (updatedMerchant) {
                // Remove the password field from the result before returning.
                const { password, ...merchant } = updatedMerchant;
                return merchant;
            }

            throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
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

    async fetchUploadPath(fileName: string) {
        const isLocal = this.configService.get<boolean>('IS_LOCAL_STORAGE');
        console.log('islocal: ', isLocal);

        if (isLocal) {
            const destination = this.configService.get<string>('UPLOADED_FILES_DESTINATION');

            const filePath = path.join(__dirname, '..', '..', '..', '..', destination, fileName);
            return filePath;
        }

        const destination = this.configService.get<string>('DOCKER_UPLOAD_DIR');

        return path.join(destination, fileName);
    }

    async getMerchantIdentification(merchantId: string) {
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'systemId', 'promoterIdType', 'promoterId', 'promoterIdMime'],
        });

        // console.log('pID: ', docs);
        if (docs?.promoterId) {

            const fileName = path.basename(docs.promoterId);

            const contentType = docs.promoterIdMime;

            const filePath = await this.fetchUploadPath(fileName);
            console.log('fp: ', filePath)
            return { fileName, contentType, filePath: filePath, idType: docs.promoterIdType }
        }


        throw new HttpException('Merchant ID Card not found', HttpStatus.NOT_FOUND);
    }


    async getMerchantIdentificationURL(merchantId: string) {
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'systemId', 'promoterIdType', 'promoterId', 'promoterIdMime'],
        });

        console.log('pID: ', docs);

        if (docs.promoterId) {

            const fileName = path.basename(docs.promoterId);

            const contentType = docs.promoterIdMime;

            const filePath = await this.fetchUploadPath(fileName);
            console.log('fp: ', fileName)
            return { fileName, contentType, filePath: filePath }
        }


        throw new HttpException('Merchant ID Card not found', HttpStatus.NOT_FOUND);
    }

    async getMerchantLogo(merchantId: string) {
        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'logoUrl', 'logoMime', 'logoPath'],

        });

        if (docs?.logoPath) {

            const fileName = path.basename(docs.logoPath);
            console.log('fn: ', fileName)
            const filePath = await this.fetchUploadPath(fileName);

            const contentType = docs.logoMime;
            return { fileName, contentType, filePath: filePath }
        }


        throw new HttpException('Merchant Logo not found', HttpStatus.NOT_FOUND);

    }

    async getMerchantCACDocs(merchantId: string, baseUrl: string) {

        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'cacDocuments'],

        });

        if(!docs){
            throw new HttpException('Merchant CAC not found', HttpStatus.NOT_FOUND);
        }

        return docs;

    }


    async getMerchantCACDocument(merchantId: string, docName: string, mimeType: string) {

        const docs = await this.merchantRepository.findOne({
            where: {
                id: merchantId
            },
            select: ['id', 'cacDocuments'],
        });

        if (!docs) {
            throw new HttpException('Merchant not found', HttpStatus.NOT_FOUND);
        }

        const filePath = await this.fetchUploadPath(docName);

        return { fileName: docName, contentType: mimeType, filePath: filePath };
    }


    async getMerchantByEmail(email: string): Promise<MerchantEntity> {

        let merchants = await this.merchantRepository.createQueryBuilder('m')
            .select(['m.id', 'm.systemId', 'm.email', 'm.name', 'm.logoUrl', 'm.promoterFname', 'm.promoterLname', 'm.bvn', 'm.businessType', 'm.isRegistered', 'm.isActive', 'm.isVerified',  'm.isConfirmed', 'm.promoterIdType', 'm.websiteUrl', 'm.phone', 'm.address', 'm.avgMonthlySales', 'm.accountNo', 'm.bankCode', 'm.bankName', 'm.socials', 'm.regDate', 'm.modifiedDate', 'm.availableBalance', 'm.password'])
            .where("LOWER(email) = LOWER(:email)", { email })
            .getOne();

        return merchants;
    }

    async getMerchantBalance(mid: string): Promise<MerchantEntity> {

        let merchants = await this.merchantRepository.createQueryBuilder('m')
            .select(['m.id', 'm.systemId', 'm.availableBalance'])
            .where("id = :mid", { mid })
            .getOne();

        if(!merchants)
            throw new Error("Invalid merchant ID")

        return merchants;
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

}
