import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMerchantProductsDto } from 'src/merchant-product/dto/CreateProducts.dto';
import { UpdateMerchantProductDto } from 'src/merchant-product/dto/UpdateProduct.dto';
import { Merchant, MerchantProduct } from 'src/typeorm';
import { LessThan, LessThanOrEqual, Repository } from 'typeorm';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { LoadImageUrl } from 'src/types/image.url.interface';
import { GetProductDto } from 'src/merchant-product/dto/GetProduct.dto';
import { ProductImageDto } from 'src/merchant-product/dto/Upload.dto';


@Injectable()
export class MerchantProductService {

    constructor(
        @InjectRepository(MerchantProduct)
        private readonly merchantProductRepository: Repository<MerchantProduct>,
        @InjectRepository(Merchant)
        private readonly merchantRepository: Repository<Merchant>,
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) { }

    // async fetchUploadPath(fileName: string) {
    //     const isLocal = this.configService.get<boolean>('IS_LOCAL_STORAGE');
    //     console.log('islocal: ', isLocal);

    //     if (isLocal) {
    //         const destination = this.configService.get<string>('UPLOADED_FILES_DESTINATION');

    //         const filePath = path.join(__dirname, '..', '..', '..', '..', destination, fileName);
    //         return filePath;
    //     }

    //     const destination = this.configService.get<string>('DOCKER_UPLOAD_DIR');

    //     return path.join(destination, fileName);
    // }



    async createProducts(createMerchantProductDto: CreateMerchantProductsDto): Promise<MerchantProduct> {
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
        merchantProduct.actualPrice = createMerchantProductDto.actualPrice;
        merchantProduct.summary = createMerchantProductDto.summary;
        merchantProduct.quantity = createMerchantProductDto.quantity;
        merchantProduct.pImages = createMerchantProductDto.images;
        merchantProduct.description = createMerchantProductDto.description;
        merchantProduct.category = createMerchantProductDto.category;
        merchantProduct.merchant = merchant;


        let savedProduct = await this.merchantProductRepository.save(merchantProduct);

        // let { id, promoterFname, promoterLname,  } = savedProduct.merchant;
        // savedProduct = {
        //     ...savedProduct,
        //     merchant: {
        //         id, promoterFname, promoterLname
        //     }
        // }

        return savedProduct;
    }

    appendProductUrl(productImages: ProductImageDto[], baseUrl: string): ProductImageDto[] {

        const npImages = productImages.map((np) => {
            const updatedImage = { ...np };

            updatedImage.imgUrl = baseUrl + np.name;

            return updatedImage;
        })

        return npImages;

    }

    async findAll(baseUrl: string): Promise<GetProductDto[]> {
        let products = await this.merchantProductRepository.find();

        if (!products)
            throw new Error("No Products to Show")

        const updatedProducts = products.map((product) => {
            const newProduct = { ...product };

            if (newProduct.pImages && newProduct.pImages.length > 0) {
                const updatedProductImages = this.appendProductUrl(product.pImages, baseUrl);

                const npImages = updatedProductImages;

                newProduct.pImages = npImages;
            }

            return newProduct;
        })


        return updatedProducts;
    }

    async findByMerchantId(mid: string, baseUrl: string): Promise<MerchantProduct[]> {
        let products = await this.merchantProductRepository.find({
            where: {
                merchant: {
                    id: mid
                }
            },
        });

        if (!products)
            throw new Error("No Products to Show")

        const updatedProducts = products.map((product) => {
            const newProduct = { ...product };

            if (newProduct.pImages && newProduct.pImages.length > 0) {
                const updatedProductImages = this.appendProductUrl(product.pImages, baseUrl);

                const npImages = updatedProductImages;

                newProduct.pImages = npImages;
            }

            return newProduct;
        })


        return updatedProducts;
    }

    async findByMerchantIdWithinRange(mid: string, baseUrl: string, amount: number): Promise<MerchantProduct[]> {
        let products = await this.merchantProductRepository.find({
            where: {
                merchant: {
                    id: mid
                },
                price: LessThanOrEqual(amount)
            },
        });

        if (!products)
            throw new Error("No Products to Show")

        const updatedProducts = await products.map((product) => {
            const newProduct = { ...product };

            if (newProduct.pImages && newProduct.pImages.length > 0) {
                const updatedProductImages = this.appendProductUrl(product.pImages, baseUrl);

                const npImages = updatedProductImages;

                newProduct.pImages = npImages;
            }

            return newProduct;
        })


        return updatedProducts;

    }

    async findOne(id: number, baseUrl: string): Promise<MerchantProduct> {
        let product = await this.merchantProductRepository.findOne({
            where: { id: id }
        });

        if (!product)
            throw new Error("No Product with ID: " + id);

        if (product.pImages && product.pImages.length > 0) {

            const updatedProductImages = this.appendProductUrl(product.pImages, baseUrl);

            const npImages = updatedProductImages;

            product.pImages = npImages;
        }

        return product;
    }

    async update(id: number, updateMerchantProductDto: UpdateMerchantProductDto): Promise<MerchantProduct> {
        
        // try{

            const merchantProduct = await this.merchantProductRepository.findOne({
                where: {
                    id: id
                }
            });
    
            if (!merchantProduct)
                throw new Error('Product not found!!')
    
            // console.log('HH: ', merchantProduct.pImages);
    
            // console.log('HO: ', updateMerchantProductDto.images);
    
            if (updateMerchantProductDto.existingImageString && merchantProduct.pImages && merchantProduct.pImages.length > 0) {
                let existingImgs: LoadImageUrl[] = JSON.parse(updateMerchantProductDto.existingImageString);
    
                // console.log('HI: ', existingImgs);
    
                merchantProduct.pImages = merchantProduct.pImages.filter((object) =>
                    existingImgs.some((otherObject) => otherObject.name === object.name)
                );
    
                // console.log('HF: ', merchantProduct.pImages);
    
                updateMerchantProductDto.images = merchantProduct.pImages.concat(updateMerchantProductDto.images);
            }
    
            merchantProduct.item = updateMerchantProductDto.item || merchantProduct.item;
            merchantProduct.price = updateMerchantProductDto.price || merchantProduct.price;
            merchantProduct.description = updateMerchantProductDto.description || merchantProduct.description;
    
            merchantProduct.actualPrice = updateMerchantProductDto.actualPrice || merchantProduct.actualPrice;
            merchantProduct.summary = updateMerchantProductDto.summary || merchantProduct.summary;
            merchantProduct.quantity = updateMerchantProductDto.quantity || merchantProduct.quantity;
            merchantProduct.pImages = updateMerchantProductDto.images || merchantProduct.pImages;
            merchantProduct.description = updateMerchantProductDto.description || merchantProduct.description;
            merchantProduct.category = updateMerchantProductDto.category || merchantProduct.category;
    
            return await this.merchantProductRepository.save(merchantProduct);

        // }catch(error){
            
        //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        // }
        
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

    async remove(id: number): Promise<boolean> {
        
        const val = await this.merchantProductRepository.delete(id);
        if(val.affected != 1){
            throw new Error('Product not found!!')
        }
        return true
    }




}
