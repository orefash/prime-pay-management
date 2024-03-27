import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ProductImageDto } from './Upload.dto';
import PRODUCTCATEGORIES from '../../statics/types/ProductTypes';
// import PRODUCTCATEGORIES from 'src/statics/types/ProductTypes';

export class CreateMerchantProductsDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  item: string;

  @IsNotEmpty()  
  @Transform((value) => Number(value))
  price: number;

  @IsOptional()  
  @Transform((value) => Number(value))
  actualPrice: number;

  @IsOptional()  
  @Transform((value) => Number(value))
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  summary: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(PRODUCTCATEGORIES)
  @MaxLength(25)
  category: string;

  @IsNotEmpty()
  @IsString()
  merchantId: string;

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  images: ProductImageDto[];

}
