import { IDTYPES } from "../../statics/types/IDTypes";
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetMerchantIdDTO {
    @IsNotEmpty()
    @IsString()
    @IsIn(IDTYPES)
    promoterIdType: string;

    // @IsNotEmpty()
    @IsString()
    @IsOptional()
    promoterId?: string;

    @IsString()
    @IsOptional()
    promoterIdMime?:string;

    @IsString()
    @IsOptional()
    promoterIdUrl?:string;

}