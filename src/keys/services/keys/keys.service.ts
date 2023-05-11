import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantsService } from 'src/merchants/services/merchants/merchants.service';
import { MerchantKey } from 'src/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KeysService {
    constructor(
        @InjectRepository(MerchantKey)
        private merchantKeyRepository: Repository<MerchantKey>,
        @Inject(MerchantsService)
        private readonly merchantService: MerchantsService
    ) { }

    generateKey():string {
        const uniqueKey = uuidv4({ format: 'hex' });
        return uniqueKey;
    }

    async create(merchantID: string): Promise<MerchantKey> {
        try {
            const merchant = await this.merchantService.getMerchantById(merchantID);
            if (!merchant)
                throw new Error('Merchant not found');


            let merchantKeyData = {
                merchant: merchant,
                live_private_key: this.generateKey(),
                live_public_key: this.generateKey(),
                test_private_key: this.generateKey(),
                test_public_key: this.generateKey()
            }

            return await this.merchantKeyRepository.save(merchantKeyData);
        } catch (err) {
            throw new Error(`Error creating merchant key: ${err.message}`);
        }
    }

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

    async update(id: number, merchantKey: MerchantKey): Promise<MerchantKey> {
        try {
            await this.merchantKeyRepository.update(id, merchantKey);
            return await this.findOne(id);
        } catch (err) {
            throw new Error(`Error updating merchant key: ${err.message}`);
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
