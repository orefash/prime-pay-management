
import { IsNotEmpty, IsString } from "class-validator";


export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    mid: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}
