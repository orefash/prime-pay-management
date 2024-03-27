
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, } from "class-validator";
import { LoadImageUrl } from "../../types/image.url.interface";


export class CACDocType {

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
    docUrl?: string;

    @IsString()
    @IsOptional()
    previewUrl?: string;

}

export class updateMerchantCACDocDTO {

    @IsOptional()
    @IsString()
    merchantID?: string;

    @IsOptional()
    @IsArray()
    docs: CACDocType[];

    @IsOptional()
    @IsArray()
    exsitingDocs?: LoadImageUrl[];

    @IsOptional()
    @IsString()
    existingDocString?: string;

}