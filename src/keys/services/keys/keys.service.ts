import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantKey } from 'src/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KeysService {
    constructor(
        @InjectRepository(MerchantKey)
        private merchantKeyRepository: Repository<MerchantKey>,
      ) {}
    
      async create(merchantKey: MerchantKey): Promise<MerchantKey> {
        try {
          return await this.merchantKeyRepository.save(merchantKey);
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
            where: {id}
          });
          if (!merchantKey) {
            throw new Error(`Merchant key with id ${id} not found`);
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
