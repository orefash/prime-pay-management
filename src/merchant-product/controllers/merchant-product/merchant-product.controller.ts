import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { CreateMerchantProductDto } from 'src/merchant-product/dto/CreateProduct.dto';
import { UpdateMerchantProductDto } from 'src/merchant-product/dto/UpdateProduct.dto copy';
import { MerchantProductService } from 'src/merchant-product/services/merchant-product/merchant-product.service';
import { MerchantProduct } from 'src/typeorm';

@Controller('merchant-product')
export class MerchantProductController {
  constructor(private readonly merchantProductService: MerchantProductService) {}

  @Post()
  @UseInterceptors(
    CustomFileInterceptor(
        'productImage',
        ['image/jpeg', 'image/png']
    ),
)
  async create(
    @Body() createMerchantProductDto: CreateMerchantProductDto,
    @UploadedFile() productImage: Express.Multer.File,
  ): Promise<MerchantProduct> {
    try {
        if(productImage){
            createMerchantProductDto.imagePath = productImage.filename;
            createMerchantProductDto.imageMime = productImage.mimetype
        }

      return await this.merchantProductService.create(createMerchantProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<MerchantProduct[]> {
    return await this.merchantProductService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MerchantProduct> {
    const product = await this.merchantProductService.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMerchantProductDto: UpdateMerchantProductDto,
  ): Promise<MerchantProduct> {
    try {
      return await this.merchantProductService.update(id, updateMerchantProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/toggle-active')
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<MerchantProduct> {
    try {
      return await this.merchantProductService.toggleActive(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.merchantProductService.remove(id);
  }

  @Get('merchant/:id')
  async findByMerchantId(@Param('id', ParseIntPipe) id: number): Promise<MerchantProduct[]> {
    const products = await this.merchantProductService.findByMerchantId(id);

    if (products.length === 0) {
      throw new NotFoundException(`No products found for merchant with id ${id}`);
    }

    return products;
  }

  @Get('merchant/:id/within-range/:amount')
  async findByMerchantIdWithinRange(
    @Param('id', ParseIntPipe) id: number,
    @Param('amount', ParseIntPipe) amount: number,
  ): Promise<MerchantProduct[]> {
    const products = await this.merchantProductService.findByMerchantIdWithinRange(id, amount);

    if (products.length === 0) {
      throw new NotFoundException(`No products found for merchant with id ${id} within price range of ${amount}`);
    }

    return products;
  }
}
