import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMerchantProductDto {

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  item: string;

  @IsNotEmpty()  
//   @IsNumberString()
  @Transform((value) => Number(value))
//   @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsString()
  imageMime?: string;

  @IsNotEmpty()
  @IsString()
  merchantId: string;

}
