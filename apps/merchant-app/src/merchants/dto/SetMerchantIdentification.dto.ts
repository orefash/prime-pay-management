import { LoadImageUrl } from "@app/db-lib/types/image.url.interface";
import { IDTYPES } from "../../statics/types/IDTypes";
import {  IsArray, IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


// export class SetMerchantIdDTO {
//     @IsNotEmpty()
//     @IsString()
//     @IsIn(IDTYPES)
//     promoterIdType: string;

//     // @IsNotEmpty()
//     @IsString()
//     @IsOptional()
//     promoterId?: string;

//     @IsString()
//     @IsOptional()
//     promoterIdMime?:string;

//     @IsString()
//     @IsOptional()
//     promoterIdUrl?:string;

// }


export class IDDocType {

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
    @IsIn(IDTYPES)
    @IsNotEmpty()
    idType: string;

    @IsString()
    @IsOptional()
    docUrl?: string;

    @IsString()
    @IsOptional()
    previewUrl?: string;

}

export class updateMerchantIDDocDTO {

    @IsOptional()
    @IsString()
    merchantID?: string;

    @IsOptional()
    @IsArray()
    docs: IDDocType[];

    @IsNotEmpty()
    @IsString()
    idTypes: string;


    // @IsOptional()
    // @IsArray()
    // exsitingDocs?: LoadImageUrl[];

    @IsOptional()
    @IsString()
    existingDocString?: string;

}