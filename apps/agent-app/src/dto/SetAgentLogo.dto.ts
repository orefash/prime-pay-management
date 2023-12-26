
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetAgentLogoDto {

    // @IsString()
    // @IsNotEmpty()
    // logoPath: string;

    @IsString()
    @IsNotEmpty()
    logoUrl: string;

    @IsString()
    @IsNotEmpty()
    logoMime:string;

}