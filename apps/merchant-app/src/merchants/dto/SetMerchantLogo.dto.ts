
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetMerchantLogoDto {

    @IsString()
    @IsOptional()
    logoPath?: string;

    @IsString()
    @IsNotEmpty()
    logoMime:string;


    @IsString()
    @IsNotEmpty()
    logoUrl:string;

}