import { IDTYPES } from "src/statics/types/IDTypes";
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetMerchantLogoDto {

    @IsString()
    @IsNotEmpty()
    logoPath: string;

    @IsString()
    @IsNotEmpty()
    logoMime:string;

}