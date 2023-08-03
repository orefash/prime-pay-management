import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductImageDto {

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  // @IsBoolean()
  // @IsNotEmpty()
  // isMain: boolean;

}