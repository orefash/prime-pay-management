import { IDTYPES } from "src/statics/types/IDTypes";
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetCACDto {

    @IsString()
    @IsNotEmpty()
    cacPath: string;

    @IsString()
    @IsNotEmpty()
    cacMime:string;

}