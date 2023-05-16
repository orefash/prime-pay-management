import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMerchantProductDto } from 'src/merchant-product/dto/CreateProduct.dto';
import { UpdateMerchantProductDto } from 'src/merchant-product/dto/UpdateProduct.dto copy';
import { Merchant, MerchantProduct } from 'src/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class MerchantProductService {

    constructor(
        @InjectRepository(MerchantProduct)
        private readonly merchantProductRepository: Repository<MerchantProduct>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
    ) { }

    async create(createMerchantProductDto: CreateMerchantProductDto): Promise<MerchantProduct> {
        const merchant = await this.merchantRepository.findOne({
            where: {
                id: createMerchantProductDto.merchantId
            }
        });

        if (!merchant) {
            throw new NotFoundException(`Merchant with id ${createMerchantProductDto.merchantId} not found`);
        }

        merchant.password = null;

        const merchantProduct = new MerchantProduct();
        merchantProduct.item = createMerchantProductDto.item;
        merchantProduct.price = createMerchantProductDto.price;
        merchantProduct.description = createMerchantProductDto.description;
        merchantProduct.imagePath = createMerchantProductDto.imagePath;
        merchantProduct.imageMime = createMerchantProductDto.imageMime;
        merchantProduct.merchant = merchant;


        return await this.merchantProductRepository.save(merchantProduct);
    }

    async findAll(): Promise<MerchantProduct[]> {
        return await this.merchantProductRepository.find();
    }

    async findOne(id: number): Promise<MerchantProduct> {
        return await this.merchantProductRepository.findOne({
            where: { id: id }
        });
    }

    async update(id: number, updateMerchantProductDto: UpdateMerchantProductDto): Promise<MerchantProduct> {
        const merchantProduct = await this.merchantProductRepository.findOne({
            where: {
                id: id
            }
        });

        if (!merchantProduct)
            throw new Error('Product not found!!')

        merchantProduct.item = updateMerchantProductDto.item || merchantProduct.item;
        merchantProduct.price = updateMerchantProductDto.price || merchantProduct.price;
        merchantProduct.description = updateMerchantProductDto.description || merchantProduct.description;
        merchantProduct.imagePath = updateMerchantProductDto.imagePath || merchantProduct.imagePath;
        merchantProduct.imageMime = updateMerchantProductDto.imageMime || merchantProduct.imageMime;

        return await this.merchantProductRepository.save(merchantProduct);
    }

    async toggleActive(id: number): Promise<MerchantProduct> {
        const merchantProduct = await this.merchantProductRepository.findOne({
            where: {
                id: id
            }
        });

        if (!merchantProduct)
            throw new Error('Product not found!!')

        merchantProduct.isActive = !merchantProduct.isActive;

        return await this.merchantProductRepository.save(merchantProduct);
    }

    async remove(id: number): Promise<void> {
        await this.merchantProductRepository.delete(id);
    }

    async findByMerchantId(mid: number): Promise<MerchantProduct[]> {
        return await this.merchantProductRepository.find({
            where: {
                merchant: {
                    systemId: mid
                }
            },
        });
    }

    async findByMerchantIdWithinRange(mid: number, amount: number): Promise<MerchantProduct[]> {
        return await this.merchantProductRepository.find({
            where: {
                merchant: {
                    systemId: mid
                },
                price: LessThanOrEqual(amount)
            },
        });
    }


}
