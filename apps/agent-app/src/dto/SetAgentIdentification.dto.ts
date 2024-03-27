// import { IDTYPES } from "../../statics/types/IDTypes";
import { IDTYPES } from "@app/db-lib/types/IDTypes";
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetAgentIdentificationDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(IDTYPES)
    IdType: string;

    // @IsNotEmpty()
    @IsString()
    @IsOptional()
    IdUrl?: string;

    @IsString()
    @IsOptional()
    IdMime?:string;

}