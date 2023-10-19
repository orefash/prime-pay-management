
import {  IsIn, IsNotEmpty, IsOptional, IsString,  } from "class-validator";


export class SetAgentLogoDto {

    @IsString()
    @IsNotEmpty()
    logoPath: string;

    @IsString()
    @IsNotEmpty()
    logoMime:string;

}