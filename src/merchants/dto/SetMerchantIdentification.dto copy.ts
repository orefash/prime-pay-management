import { IDTYPES } from "src/statics/types/IDTypes";
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

}