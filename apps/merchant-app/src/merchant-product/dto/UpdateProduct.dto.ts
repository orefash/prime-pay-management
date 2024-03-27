import { Transform } from 'class-transformer';
import { ArrayMinSize, IsArray, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ProductImageDto } from './Upload.dto';
import PRODUCTCATEGORIES from '../../statics/types/ProductTypes';
import { LoadImageUrl } from '../../types/image.url.interface';


export class UpdateMerchantProductDto {

  @IsOptional()
  @IsString()
  @MaxLength(100)
  item?: string;

  @IsOptional()  
  @Transform((value) => Number(value))
  price?: number;

  @IsOptional()  
  @Transform((value) => Number(value))
  actualPrice?: number;

  @IsOptional()  
  @Transform((value) => Number(value))
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  summary?: string;

  @IsOptional()
  @IsString()
  @IsIn(PRODUCTCATEGORIES)
  @MaxLength(25)
  category?: string;

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  images?: ProductImageDto[];

  @IsOptional()
  @IsArray()
  // @ArrayMinSize(1)
  existingImages?: LoadImageUrl[];

  @IsOptional()
  @IsString()
  // @ArrayMinSize(1)
  existingImageString?: string;

}
