import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import CustomFileInterceptor from 'src/interceptors/file-upload.interceptor';
import { CreateMerchantProductsDto } from 'src/merchant-product/dto/CreateProducts.dto';
import { UpdateMerchantProductDto } from 'src/merchant-product/dto/UpdateProduct.dto';
import { ProductImageDto } from 'src/merchant-product/dto/Upload.dto';
import { MerchantProductService } from 'src/merchant-product/services/merchant-product/merchant-product.service';
import { MerchantProduct } from 'src/typeorm';

@Controller('merchant-product')
export class MerchantProductController {
  constructor(private readonly merchantProductService: MerchantProductService) { }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1];
          callback(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Validate the file type
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Body() createProductDto: CreateMerchantProductsDto) {
    // Save the files to the server
    // console.log('body: ', createProductDto)


    try {

      let fileList: ProductImageDto[] = [];

      for (const file of files) {
        const path = file.path;
        const name = file.filename;
        const mimeType = file.mimetype;
        // Process the file or save it to the database
        // console.log('Uploaded file:', filePath);
        // console.log('Uploaded file:', fileName);
        fileList.push({
          name, path, mimeType
        })
      }

      createProductDto.images = fileList;

      // console.log('data: ', createProductDto)

      return await this.merchantProductService.createProducts(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }




  @Get()
  async findAll(@Req() req): Promise<MerchantProduct[]> {

    const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

    return await this.merchantProductService.findAll(baseUrl);
  }



  @Get('merchant/:id')
  async findByMerchantId(@Req() req, @Param('id') id: string): Promise<MerchantProduct[]> {

    const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

    const products = await this.merchantProductService.findByMerchantId(id, baseUrl);

    if (products.length === 0) {
      throw new NotFoundException(`No products found for merchant with id ${id}`);
    }

    return products;
  }

  @Get('merchant/:id/within-range/:amount')
  async findByMerchantIdWithinRange(
    @Req() req,
    @Param('id') id: string,
    @Param('amount', ParseIntPipe) amount: number,
  ): Promise<MerchantProduct[]> {

    const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;


    const products = await this.merchantProductService.findByMerchantIdWithinRange(id, baseUrl, amount);

    if (products.length === 0) {
      throw new NotFoundException(`No products found for merchant with id ${id} within price range of ${amount}`);
    }

    return products;
  }



  @Get(':id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<MerchantProduct> {

    const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

    const product = await this.merchantProductService.findOne(id, baseUrl);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }


  @Patch('update/:id')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.mimetype.split('/')[1];
          callback(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Validate the file type
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Unsupported file type'), false);
        }
      },
    }),
  )
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() editProductDto: UpdateMerchantProductDto) {
    // Save the files to the server
    // console.log('edit body: ', editProductDto)

    try {


      let fileList: ProductImageDto[] = [];

      for (const file of files) {
        const path = file.path;
        const name = file.filename;
        const mimeType = file.mimetype;
        fileList.push({
          name, path, mimeType
        })
      }

      editProductDto.images = fileList;

      console.log('edit data images: ', editProductDto)

      return await this.merchantProductService.update(id, editProductDto);
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

}
