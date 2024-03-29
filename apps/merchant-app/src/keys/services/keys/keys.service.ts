import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyFindResponse } from '../../types/KeyFindResponse';
import { Merchant, MerchantKey } from '../../../typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class KeysService {
    constructor(
        @InjectRepository(MerchantKey)
        private merchantKeyRepository: Repository<MerchantKey>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        // @Inject(forwardRef(() => MerchantsService)) 
        // private readonly merchantService: MerchantsService
    ) { }

    generateKey(isLive: boolean, isPub: boolean): string {

        // console.log(`islive: ${isLive} |  isPub: ${isPub}`)
        // let uniqueKey = uuidv4({ nodash: true }).replace(/-/g, '');
        let uniqueKey = uuidv4().replace(/-/g, '');

        let init = 'prm';

        if (isPub)
            init = init + '_pubk';
        else
            init = init + '_prvk';

        if (isLive)
            init = init + '_live_'
        else
            init = init + '_test_'

        uniqueKey = init + uniqueKey;

        return uniqueKey;
    }



    async createMerchantKey(merchant: Merchant): Promise<Merchant> {
        try {

            console.log("In key and merchant create")
            const key = new MerchantKey();
            key.live_private_key = this.generateKey(true, false);
            key.live_public_key = this.generateKey(true, true);
            key.test_private_key = this.generateKey(false, false);
            key.test_public_key = this.generateKey(false, true);


            // let merchantKeyData = {
            //     merchant: merchant,
            //     live_private_key: this.generateKey(true, false),
            //     live_public_key: this.generateKey(true, true),
            //     test_private_key: this.generateKey(false, false),
            //     test_public_key: this.generateKey(false, true)
            // }

            // merchant.keys = key;



            let createdMerchant = await this.merchantRepository.save(merchant);
            key.merchant = createdMerchant;
            await this.merchantKeyRepository.save(key);

            return createdMerchant;
        } catch (err) {
            throw new Error(`Error creating merchant key: ${err.message}`);
        }
    }

    // async create(merchant: Merchant): Promise<MerchantKey> {
    //     try {

    //         let merchantKeyData = {
    //             merchant: merchant,
    //             live_private_key: this.generateKey(true, false),
    //             live_public_key: this.generateKey(true, true),
    //             test_private_key: this.generateKey(false, false),
    //             test_public_key: this.generateKey(false, true)
    //         }

    //         return await this.merchantKeyRepository.save(merchantKeyData);
    //     } catch (err) {
    //         throw new Error(`Error creating merchant key: ${err.message}`);
    //     }
    // }

    async findAll(): Promise<MerchantKey[]> {
        try {
            return await this.merchantKeyRepository.find();
        } catch (err) {
            throw new Error(`Error retrieving merchant keys: ${err.message}`);
        }
    }

    async findOne(id: number): Promise<MerchantKey> {
        try {
            const merchantKey = await this.merchantKeyRepository.findOne({
                where: { id }
            });
            if (!merchantKey) {
                throw new Error(`Merchant key with id ${id} not found`);
            }
            return merchantKey;
        } catch (err) {
            throw new Error(`Error retrieving merchant key: ${err.message}`);
        }
    }

    async findByMerchant(MerchantId: string): Promise<MerchantKey> {
        try {
            console.log("ID: ", MerchantId);
            const merchantKey = await this.merchantKeyRepository.findOne({
                where: { merchant: { id: MerchantId } },
            });
            if (!merchantKey) {
                throw new Error(`Merchant key not found`);
            }
            return merchantKey;
        } catch (err) {
            throw new Error(`Error retrieving merchant key: ${err.message}`);
        }
    }


    async findByKey(publicKey: string): Promise<Partial<KeyFindResponse>> {
        try {

            const merchantKey = await this.merchantKeyRepository.findOne({
                where: [
                    { live_public_key: publicKey },
                    { test_public_key: publicKey },
                ],
                relations: ['merchant'],
            });

            if (!merchantKey || !merchantKey.merchant) {
                throw new Error(`Merchant key is Invalid`);
            }

            let isLive = false;
            if (merchantKey.live_public_key === publicKey){
                isLive = true;
                if(!merchantKey.isLiveActive)
                    throw new Error('Key is not Active')
            }else{
                if(!merchantKey.isTestActive)
                    throw new Error('Key is not Active')
            }
                

            let { systemId, name } = merchantKey.merchant;

            let responseData = {
                isLive, systemId, name
            }
            return responseData;
        } catch (err) {
            throw new Error(`${err.message}`);
        }
    }

    // async update(id: number, merchantKey: MerchantKey): Promise<MerchantKey> {
    //     try {
    //         await this.merchantKeyRepository.update(id, merchantKey);
    //         return await this.findOne(id);
    //     } catch (err) {
    //         throw new Error(`Error updating merchant key: ${err.message}`);
    //     }
    // }


    async resetKeys(mid: string, isLive: boolean): Promise<MerchantKey> {
        try {

            let updateData: Partial<MerchantKey> = {}
            if (isLive === true) {
                updateData.live_private_key = this.generateKey(true, false);
                updateData.live_public_key = this.generateKey(true, true);
            } else {
                updateData.test_private_key = this.generateKey(false, false);
                updateData.test_public_key = this.generateKey(false, true);
            }

            // console.log(`reset:  isupd: ${JSON.stringify(updateData)} | islive: ${isLive}  | type: ${typeof(isLive)}`)


            // console.log('upd: ', updateData)
            await this.merchantKeyRepository.update({
                merchant: { id: mid }
            }, updateData);
            return await this.findByMerchant(mid);
        } catch (err) {
            throw new Error(`Error resetting key: ${err.message}`);
        }
    }

    async toggleKeyState(mid: string, isLive: boolean): Promise<MerchantKey> {
        try {
            const keyData: MerchantKey = await this.findByMerchant(mid);
            let updateData: Partial<MerchantKey> = {}
            if (isLive == true) {
                // console.log('in islive')
                updateData.isLiveActive = !keyData.isLiveActive;
            } else {
                updateData.isTestActive = !keyData.isTestActive;
            }

            // console.log(`isupd: ${JSON.stringify(updateData)} | islive: ${isLive}  | type: ${typeof(isLive)}`)

            await this.merchantKeyRepository.update({
                merchant: { id: mid }
            }, updateData);
            return await this.findByMerchant(mid);
        } catch (err) {
            throw new Error(`Error toggling key: ${err.message}`);
        }
    }

    async delete(id: number): Promise<void> {
        try {
            const result = await this.merchantKeyRepository.delete(id);
            if (result.affected === 0) {
                throw new Error(`Merchant key with id ${id} not found`);
            }
        } catch (err) {
            throw new Error(`Error deleting merchant key: ${err.message}`);
        }
    }
}
