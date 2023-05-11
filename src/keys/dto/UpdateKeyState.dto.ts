import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Length } from "class-validator";




export class UpdateKeyStateDTO {

    @IsString()
    @IsNotEmpty()
    merchantID: string;

    @IsBoolean()
    @IsNotEmpty()
    isLive: boolean;

}