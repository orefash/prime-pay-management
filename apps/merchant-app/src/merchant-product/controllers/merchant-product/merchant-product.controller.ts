import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage, diskStorage } from 'multer';
// import { CreateMerchantProductsDto } from 'src/merchant-product/dto/CreateProducts.dto';
import { UpdateMerchantProductDto } from '../../dto/UpdateProduct.dto';
import { ProductImageDto } from '../../dto/Upload.dto';
import { MerchantProductService } from '../../services/merchant-product/merchant-product.service';
import { MerchantProduct } from '../../../typeorm';
import { CreateMerchantProductsDto } from '../../dto/CreateProducts.dto';
import { generateUniqueFilename } from '@app/utils/utils/file-upload';
import { SpacesService } from 'apps/merchant-app/src/digital-ocean/services/spaces/spaces.service';

@Controller('merchant-product')
export class MerchantProductController {
  constructor(
    private readonly merchantProductService: MerchantProductService,
    private readonly doSpacesService: SpacesService
    ) { }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      
      storage: memoryStorage(),
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
        // const name = file.filename;
        const name = await generateUniqueFilename("STO", file.originalname);


        let spaceFilename = `merchant-id/${name}`;


        let fileUrl = await this.doSpacesService.uploadFile(file.buffer, spaceFilename);


        const mimeType = file.mimetype;
        // Process the file or save it to the database
        // console.log('Uploaded file:', filePath);
        // console.log('Uploaded file:', fileName);
        fileList.push({
          name, path, mimeType, imgUrl: fileUrl
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

    try {
      // const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

      return await this.merchantProductService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }



  @Get('merchant/:id')
  async findByMerchantId(@Req() req, @Param('id') id: string): Promise<MerchantProduct[]> {

    try {
      const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

      const products = await this.merchantProductService.findByMerchantId(id);

      if (products.length === 0) {
        throw new NotFoundException(`No products found for merchant with id ${id}`);
      }

      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }

  @Get('merchant/:id/within-range/:amount')
  async findByMerchantIdWithinRange(
    @Req() req,
    @Param('id') id: string,
    @Param('amount', ParseIntPipe) amount: number,
  ): Promise<MerchantProduct[]> {


    try {
      const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;


      const products = await this.merchantProductService.findByMerchantIdWithinRange(id, amount);

      if (products.length === 0) {
        throw new NotFoundException(`No products found for merchant with id ${id} within price range of ${amount}`);
      }

      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

  }



  @Get(':id')
  async findOne(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<MerchantProduct> {

    try {
      const baseUrl = `${req.protocol}://${req.headers.host}/api/images/`;

      const product = await this.merchantProductService.findOne(id);

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      return product;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }

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

      // console.log('edit data images: ', editProductDto)

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
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const deleted = await this.merchantProductService.remove(id);
      return { deleted: deleted }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    
  }

}
